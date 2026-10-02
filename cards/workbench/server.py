"""Internal single-recipe editing/render acceptance workbench, not a public service."""
import argparse
import ipaddress
import json
import os
from pathlib import Path
import re
import subprocess
import threading
import uuid
import zipfile
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

CARDS = Path(__file__).resolve().parents[1]
WEB = Path(__file__).parent / 'public'
OUTPUT = CARDS / 'out/workbench'
JOBS = {}
LOCK = threading.Lock()
RENDER = threading.Semaphore(1)


def validate_project(props):
    result = subprocess.run(['node', '-e', 'const {timeline}=require(process.argv[1]); let s=""; process.stdin.on("data",c=>s+=c); process.stdin.on("end",()=>{try{console.log(JSON.stringify(timeline(JSON.parse(s))))}catch(e){console.error(e.message);process.exitCode=1}})', str(CARDS/'scripts/delivery_timeline.cjs')], input=json.dumps(props), text=True, capture_output=True, timeout=15, cwd=CARDS)
    if result.returncode:
        raise ValueError(result.stderr[:500])
    return json.loads(result.stdout)


def render_job(job_id, props):
    job = JOBS[job_id]
    folder = OUTPUT / job_id
    try:
        folder.mkdir(parents=True)
        data = folder/'input.json'
        data.write_text(json.dumps(props, ensure_ascii=False), encoding='utf-8')
        args = ['node', str(CARDS/'scripts/export_jianying.cjs'), f'--out={folder / "package"}', f'--props={data}', '--preview=true']
        if os.environ.get('DATAMAGIC_RENDER_BROWSER'):
            args.append(f'--browser={os.environ["DATAMAGIC_RENDER_BROWSER"]}')
        with (folder/'render.log').open('w') as log:
            subprocess.run(args, stdout=log, stderr=subprocess.STDOUT, cwd=CARDS, check=True, timeout=600)
        package = folder/'package'
        if not (package/'READY.json').is_file():
            raise ValueError('Incomplete export')
        manifest = json.loads((package/'manifest.json').read_text())
        with zipfile.ZipFile(folder/'delivery.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
            for file in sorted(package.rglob('*')):
                if file.is_file():
                    archive.write(file, Path('datamagic-ranking') / file.relative_to(package))
        with LOCK:
            job.update(status='ready', manifest=manifest, video=f'/jobs/{job_id}/package/preview.mp4', package=f'/jobs/{job_id}/delivery.zip', data=f'/jobs/{job_id}/package/source-data.json')
    except Exception:
        with LOCK:
            job.update(status='failed', error='生成失败；输入已保留，检查服务器渲染日志后重试。')
    finally:
        RENDER.release()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB), **kwargs)

    def json_response(self, value, status=200):
        data = json.dumps(value, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(data)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if self.command != 'HEAD': self.wfile.write(data)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == '/api/sample':
            return self.json_response(json.loads((CARDS/'templates/ranked-reveal/sample-data.json').read_text()))
        if path.startswith('/api/jobs/'):
            with LOCK:
                job = JOBS.get(path.removeprefix('/api/jobs/'))
                result = dict(job) if job else {'error':'Job not found'}
            return self.json_response(result, 200 if job else 404)
        if path.startswith('/jobs/'):
            match = re.fullmatch(r'/jobs/([a-f0-9]{32})/(delivery.zip|package/(preview.mp4|source-data.json))', path)
            if not match or not JOBS.get(match[1],{}).get('status') == 'ready':
                return self.send_error(404)
        elif path not in ('/', '/index.html', '/app.js', '/styles.css'):
            return self.send_error(404)
        super().do_GET()

    def translate_path(self, path):
        clean = urlparse(path).path
        match = re.fullmatch(r'/jobs/([a-f0-9]{32})/(delivery.zip|package/(preview.mp4|source-data.json))', clean)
        if match:
            return str(OUTPUT / match[1] / match[2])
        return super().translate_path(path)

    def send_head(self):
        self.remaining = None
        path = Path(self.translate_path(self.path))
        request_range = self.headers.get('Range')
        if not request_range or not path.is_file():
            return super().send_head()
        size = path.stat().st_size
        match = re.fullmatch(r'bytes=(\d*)-(\d*)',request_range)
        if not match or not any(match.groups()) or not size:
            self.send_error(416); return None
        left,right = match.groups()
        start = int(left) if left else max(0,size-int(right))
        end = min(int(right),size-1) if left and right else size-1
        if start>end or start>=size:
            self.send_error(416); return None
        source = path.open('rb'); source.seek(start)
        self.remaining = end-start+1
        self.send_response(206)
        self.send_header('Content-Type',self.guess_type(str(path)))
        self.send_header('Accept-Ranges','bytes')
        self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.send_header('Content-Length',str(self.remaining))
        self.end_headers()
        return source

    def copyfile(self, source, output):
        if self.command == 'HEAD': return
        if self.remaining is None:
            return super().copyfile(source,output)
        while self.remaining:
            block=source.read(min(65536,self.remaining))
            if not block: break
            output.write(block); self.remaining-=len(block)

    def do_HEAD(self):
        # Apply the GET allowlist to HEAD requests too.
        self.do_GET()

    def do_POST(self):
        if self.path != '/api/render':
            return self.json_response({'error':'Not found'},404)
        # Browser writes must come from this same-origin page, not a foreign website.
        origin = self.headers.get('Origin')
        if origin and origin != f'http://{self.headers.get("Host")}':
            return self.json_response({'error':'Cross-origin writes refused'},403)
        if self.headers.get('Content-Type') != 'application/json':
            return self.json_response({'error':'JSON required'},415)
        try:
            length = int(self.headers.get('Content-Length','0'))
            if not 0 < length <= 16384:
                raise ValueError('Invalid request size')
            props = json.loads(self.rfile.read(length))
            manifest = validate_project(props)
        except (ValueError, KeyError, TypeError, subprocess.TimeoutExpired) as error:
            return self.json_response({'error':str(error)},400)
        with LOCK:
            if len(JOBS) >= 12:
                return self.json_response({'error':'本轮测试已满 12 个工程，请管理员检查后重启。'},429)
            if not RENDER.acquire(blocking=False):
                return self.json_response({'error':'已有工程正在渲染，请稍后重试。'},409)
            job_id = uuid.uuid4().hex
            JOBS[job_id] = {'id':job_id,'status':'rendering','manifest':manifest,'desktopValidated':False}
        threading.Thread(target=render_job,args=(job_id,props),daemon=True).start()
        self.json_response(dict(JOBS[job_id]),202)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host',default='127.0.0.1')
    parser.add_argument('--port',type=int,default=5185)
    args = parser.parse_args()
    address = ipaddress.ip_address(args.host)
    if address.is_unspecified or not (address.is_loopback or address.is_private):
        parser.error('This unauthenticated testing service must bind to localhost or an internal IP only.')
    # Recover completed generated packages after a testing-service restart.
    if OUTPUT.is_dir():
        for folder in sorted(OUTPUT.iterdir()):
            if not re.fullmatch(r'[a-f0-9]{32}',folder.name) or folder.is_symlink(): continue
            package=folder/'package'
            if (package/'READY.json').is_file() and (folder/'delivery.zip').is_file():
                try:
                    manifest=json.loads((package/'manifest.json').read_text())
                    job_id=folder.name
                    JOBS[job_id]={'id':job_id,'status':'ready','manifest':manifest,'desktopValidated':False,'video':f'/jobs/{job_id}/package/preview.mp4','package':f'/jobs/{job_id}/delivery.zip','data':f'/jobs/{job_id}/package/source-data.json'}
                except (OSError,ValueError): pass
    ThreadingHTTPServer((args.host,args.port),Handler).serve_forever()
