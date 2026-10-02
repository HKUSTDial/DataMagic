import importlib.util
import json
from pathlib import Path
import threading
import unittest
from urllib.request import Request, urlopen
from urllib.error import HTTPError

spec = importlib.util.spec_from_file_location('workbench_server', Path(__file__).parents[1]/'workbench/server.py')
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)


class WorkbenchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.http = server.ThreadingHTTPServer(('127.0.0.1',0), server.Handler)
        cls.base = f'http://127.0.0.1:{cls.http.server_port}'
        cls.thread = threading.Thread(target=cls.http.serve_forever, daemon=True)
        cls.thread.start()

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown(); cls.http.server_close(); cls.thread.join()

    def request(self, path, props=None, headers=None):
        data = None if props is None else json.dumps(props).encode()
        request = Request(self.base+path,data=data,headers=headers or {'Content-Type':'application/json'})
        try:
            with urlopen(request,timeout=20) as response:
                return response.status,response.read()
        except HTTPError as error:
            return error.code,error.read()

    def test_sample_contract_is_same_as_export(self):
        status,data = self.request('/api/sample')
        self.assertEqual(status,200)
        manifest = server.validate_project(json.loads(data))
        self.assertEqual(len(manifest['shots']),6)

    def test_invalid_data_never_starts_a_job(self):
        before = len(server.JOBS)
        status,data = self.request('/api/render', {'title':'incomplete'})
        self.assertEqual(status,400)
        self.assertIn('error',json.loads(data))
        self.assertEqual(len(server.JOBS),before)

    def test_cross_origin_write_and_form_posts_are_refused(self):
        status,_ = self.request('/api/render',{}, {'Content-Type':'application/json','Origin':'https://foreign.example'})
        self.assertEqual(status,403)
        status,_ = self.request('/api/render',{}, {'Content-Type':'text/plain'})
        self.assertEqual(status,415)

    def test_private_files_and_unready_jobs_not_served(self):
        for path in ('/server.py','/../scripts/jianying_draft.py','/jobs/'+'a'*32+'/package/render.log','/jobs/'+'a'*32+'/delivery.zip'):
            with self.subTest(path=path):
                status,_ = self.request(path)
                self.assertEqual(status,404)

    def test_render_busy_is_rejected_without_a_second_job(self):
        props = json.loads((server.CARDS/'templates/ranked-reveal/sample-data.json').read_text())
        server.RENDER.acquire()
        try:
            before = len(server.JOBS)
            status,_ = self.request('/api/render',props)
            self.assertEqual(status,409)
            self.assertEqual(len(server.JOBS),before)
        finally:
            server.RENDER.release()


if __name__ == '__main__': unittest.main()
