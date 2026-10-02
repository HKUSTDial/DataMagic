const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const Ajv=require('ajv/dist/2020');
const {pathToFileURL}=require('node:url');
async function main(){
 const file=path.join(__dirname,'sales.csv');
 const text=fs.readFileSync(file,'utf8').trim();
 // This teaching example intentionally accepts a simple wide CSV with no quoted fields.
 assert.ok(!text.includes('"'),'Quoted CSV fields require a full CSV parser');
 const [header,...rows]=text.split(/\r?\n/).map(line=>line.split(','));
 assert.equal(header[0],'月份');assert.equal(header.length,7);assert.equal(rows.length,6);
 const colors=['#3478c7','#16a085','#e6a323','#d95f59','#8d6ac8','#4f9d69'];
 const entities=header.slice(1).map((label,i)=>({id:`drink-${i+1}`,label,color:colors[i]}));
 const snapshots=rows.map(row=>{
  assert.equal(row.length,header.length);
  const values={};entities.forEach((e,i)=>{assert.ok(row[i+1].trim());const v=Number(row[i+1]);assert.ok(Number.isFinite(v)&&v>=0);values[e.id]=v;});
  return {time:row[0],values};
 });
 const base={title:'咖啡店半年销量竞赛',subtitle:'1—6月 · 六种饮品 · 演示数据',unit:'杯',source:'sales.csv · 教学演示（虚构数据）',topN:6,decimals:0,locale:'zh-CN',entities,snapshots};
 const revised={...base,title:'谁是咖啡店的增长主角？',entities:entities.map(e=>({...e,color:e.label==='拿铁'?'#7c3aed':'#94a3b8'}))};
 const validate=new Ajv().compile(JSON.parse(fs.readFileSync(path.join(__dirname,'../../templates/bar-chart-race/schema.json'))));
 const model=await import(pathToFileURL(path.join(__dirname,'../../templates/bar-chart-race/model.js')));
 for(const [name,props] of [['v1',base],['v2',revised]]){
  assert.ok(validate(props),JSON.stringify(validate.errors));model.validateRaceProps(props);
  for(const [progress,index] of [[0,0],[1,5]]){
   const state=model.createRaceFrame(props,progress);
   for(const row of state.rows)assert.equal(row.value,snapshots[index].values[row.id]);
  }
  fs.writeFileSync(path.join(__dirname,`${name}.json`),JSON.stringify(props,null,2)+'\n');
 }
 const final=model.createRaceFrame(base,1);assert.equal(final.leader.label,'拿铁');assert.equal(final.leader.value,1450);
 assert.equal(model.createRaceFrame(base,0).leader.label,'美式');
 const report={input:'sales.csv',rows:6,entities:6,numericCellsVerified:36,firstLeader:'美式',firstValue:820,lastLeader:'拿铁',lastValue:1450,finalRanking:[...final.rows].sort((a,b)=>a.displayRank-b.displayRank).map(r=>({label:r.label,value:r.value})),schemaValid:true,revisionPreservesData:JSON.stringify(base.snapshots)===JSON.stringify(revised.snapshots)};
 fs.writeFileSync(path.join(__dirname,'data-check.json'),JSON.stringify(report,null,2)+'\n');
 console.log('CSV → props: 6 months × 6 drinks, 36 values checked. Schema valid.');
 console.log('First leader: 美式 820 cups; final leader: 拿铁 1450 cups.');
 console.log('Revision: purple 拿铁; all data unchanged; +60-frame final hold.');
}
main().catch(e=>{console.error(e);process.exitCode=1});
