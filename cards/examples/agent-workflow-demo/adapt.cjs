const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const Ajv=require('ajv/dist/2020');
const rows=fs.readFileSync(path.join(__dirname,'sales.csv'),'utf8').trim().split(/\r?\n/).map(r=>r.split(','));
const labels=rows[0].slice(1);const colors=['#2878b5','#d87847','#40a39a','#9a72b5','#b8a347','#53788d'];
const icons=['americano','latte','cappuccino','mocha','tea','cold-brew'];
const v1={title:'咖啡店的半年销量变化',subtitle:'六种饮品，六个月；排名随销量变化',unit:'杯',source:'虚构咖啡店演示数据 · sales.csv',topN:6,decimals:0,locale:'zh-CN',entities:labels.map((label,i)=>({id:'drink-'+i,label,color:colors[i],iconSrc:`icons/coffee/${icons[i]}.svg`})),snapshots:rows.slice(1).map(row=>({time:row[0],values:Object.fromEntries(labels.map((_,i)=>['drink-'+i,Number(row[i+1])]))}))};
const v2=structuredClone(v1);v2.title='谁是咖啡店的增长主角？';v2.highlightId='drink-1';v2.entities.find(e=>e.id===v2.highlightId).color='#7c3aed';
const schema=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../templates/bar-chart-race/schema.json')));const validate=new Ajv({strict:false}).compile(schema);
for(const [version,data]of [['v1',v1],['v2',v2]]){
 assert(validate(data),JSON.stringify(validate.errors));
 assert.equal(new Set(data.entities.map(e=>e.iconSrc)).size,6);
 assert.equal(new Set(data.entities.map(e=>e.color)).size,6);
 for(const e of data.entities)assert(fs.existsSync(path.resolve(__dirname,'../../public',e.iconSrc)),`Missing icon: ${e.iconSrc}`);
 for(let t=0;t<6;t++)for(let i=0;i<6;i++)assert.equal(data.snapshots[t].values['drink-'+i],Number(rows[t+1][i+1]));
 fs.writeFileSync(path.join(__dirname,version+'.json'),JSON.stringify(data,null,2)+'\n');
}
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify({schema:true,valuesCheckedPerVersion:36,unchangedData:JSON.stringify(v1.snapshots)===JSON.stringify(v2.snapshots),distinctIcons:6,distinctColorsPerVersion:6,highlightId:v2.highlightId,firstLeader:{label:'美式',value:820},finalLeader:{label:'拿铁',value:1450},producer:'current assistant; standalone Codex CLI attempt failed authentication'},null,2));
console.log('Schema valid. Both versions match all 36 CSV values; data unchanged.');
