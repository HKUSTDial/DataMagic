const fs=require('node:fs');const path=require('node:path');const {spawn}=require('node:child_process');
const version=process.argv[2]||'v1';if(!['v1','v2'].includes(version))throw Error('version');
const out=path.resolve(__dirname,'../../out/agent-workflow-private');fs.mkdirSync(out,{recursive:true,mode:0o700});
const log=fs.createWriteStream(path.join(out,version+'.jsonl'),{mode:0o600});const err=fs.createWriteStream(path.join(out,version+'.stderr'),{mode:0o600});
const started=Date.now();const child=spawn('codex',['exec','--json','--skip-git-repo-check','-s','workspace-write','-C',__dirname,'-'],{cwd:__dirname,stdio:['pipe','pipe','pipe']});
child.stdout.pipe(log);child.stderr.pipe(err);child.stdin.end(fs.readFileSync(path.join(__dirname,'request-'+version+'.txt')));
child.on('exit',code=>{fs.writeFileSync(path.join(out,version+'-run.json'),JSON.stringify({code,elapsedSeconds:(Date.now()-started)/1000},null,2));console.log(JSON.stringify({version,code,elapsedSeconds:(Date.now()-started)/1000}));process.exitCode=code||0;});
