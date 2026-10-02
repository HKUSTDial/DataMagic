const $ = id => document.getElementById(id);
const form = $('editor');
let project, activeJob = null, revision = 0, submittedRevision = null;
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));
const fields = ['title','question','maximum','unit','metricLabel','takeaway','source'];
function setRows(rows) {
  $('rows').replaceChildren();
  for(const row of rows) {
    const box = document.createElement('div');box.className='row';box.dataset.id=row.id;
    for(const [key,title,type] of [['label','名称','text'],['value','数值','number'],['at','揭晓时间（秒）','number'],['caption','讲解字幕','text']]) {
      const label=document.createElement('label');label.textContent=title;
      const input=document.createElement('input');input.dataset.key=key;input.type=type;input.value=row[key];input.required=true;
      if(type==='number'){input.min='0';input.step='any';}else input.maxLength=key==='label'?18:55;
      label.append(input);box.append(label);
    }
    const remove=document.createElement('button');remove.type='button';remove.textContent='删除此项';
    remove.onclick=()=>{if($('rows').children.length<=2){alert('至少保留两项');return;}box.remove();changed();};box.append(remove);$('rows').append(box);
  }
}
function read() {
  const props=Object.fromEntries(fields.map(key=>[key,key==='maximum'?Number(form.elements[key].value):form.elements[key].value.trim()]));
  props.rows=[...$('rows').children].map(box=>Object.fromEntries([['id',box.dataset.id],...[...box.querySelectorAll('input')].map(input=>[input.dataset.key,input.type==='number'?Number(input.value):input.value.trim()])])).sort((a,b)=>b.value-a.value);
  return props;
}
function changed(){revision++;if(submittedRevision!==null)$('version').textContent='数据已修改；当前视频属于上次渲染，请重新生成。';}
form.addEventListener('input',changed);
async function load(){project=await (await fetch('/api/sample')).json();for(const key of fields)form.elements[key].value=project[key];setRows(project.rows);changed();}
$('reset').onclick=load;
$('addRow').onclick=()=>{const rows=read().rows;if(rows.length>=4){alert('此版本最多四项');return;}rows.push({id:crypto.randomUUID(),label:'新项目',value:0,at:1,caption:'请填写讲解文字'});setRows(rows);changed();};
function timeline(manifest) {
  $('timeline').replaceChildren();
  for(const [index,shot] of manifest.shots.entries()){
    const button=document.createElement('button');button.type='button';button.textContent=`镜头 ${index+1} · ${(shot.startFrame/30).toFixed(1)}–${(shot.endFrame/30).toFixed(1)} 秒`;
    button.onclick=()=>{$('video').currentTime=shot.startFrame/30;};$('timeline').append(button);
  }
}
function showOutput(job, thisRevision) {
  submittedRevision=thisRevision;$('video').hidden=false;$('video').src=job.video;$('video').load();
  $('mp4').href=job.video;$('zip').href=job.package;$('data').href=job.data;$('downloads').hidden=false;timeline(job.manifest);
  $('status').textContent='已完成真实视频与剪映包生成；下面播放的是本次输入的结果。Mac 剪映打开尚未验证。';
  $('version').textContent=revision===thisRevision?'当前视频与提交的数据一致。':'渲染期间又修改了数据；当前视频对应提交时的数据，请重新渲染新修改。';
  history.replaceState(null,'',`?job=${job.id}`);
}
form.onsubmit=async event=>{
  event.preventDefault();if(activeJob)return;
  $('render').disabled=true;$('status').textContent='正在检查数据…';
  try{
    const props=read(), thisRevision=revision;
    const response=await fetch('/api/render',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(props)});
    let job=await response.json();if(!response.ok)throw new Error(job.error);
    activeJob=job.id;$('status').textContent='正在真实渲染新工程（1080p）；可能需要数分钟。可以继续修改，修改后需另行渲染。';
    while(job.status==='rendering'){await sleep(2000);const status=await fetch(`/api/jobs/${activeJob}`);job=await status.json();if(!status.ok)throw new Error(job.error);}
    if(job.status!=='ready')throw new Error(job.error||'生成失败');
    showOutput(job,thisRevision);
  }catch(error){$('status').textContent=`未完成：${error.message}`;}finally{activeJob=null;$('render').disabled=false;}
};
async function initialLoad(){
  const id=new URLSearchParams(location.search).get('job');
  if(!id){await load();return;}
  if(!/^[a-f0-9]{32}$/.test(id))throw new Error('无效工程标识');
  const response=await fetch(`/api/jobs/${id}`);const job=await response.json();
  if(!response.ok||job.status!=='ready')throw new Error('此工程未完成或不存在');
  project=await (await fetch(job.data)).json();for(const key of fields)form.elements[key].value=project[key];setRows(project.rows);showOutput(job,revision);
}
initialLoad().catch(error=>{$('status').textContent=`加载失败：${error.message}`;});
