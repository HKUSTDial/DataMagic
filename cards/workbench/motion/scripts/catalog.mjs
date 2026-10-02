import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const library=JSON.parse(fs.readFileSync(path.join(root,'gallery/api/library.json')));
const source=fs.readFileSync(path.join(root,'src/Root.tsx'),'utf8');
const compositions=new Map([...source.matchAll(/<Composition\b([\s\S]*?)\/>/g)].map(m=>{
  const get=k=>m[1].match(new RegExp(`${k}=(?:"([^"]+)"|\\{([^}]+)\\})`));
  return [get('id')?.[1],Object.fromEntries(['component','durationInFrames','width','height','fps'].map(k=>[k,get(k)?.[2]]))];
}));
const cards=[];let imports='', registry='';
for(const item of library.cards){
  const native=item.source.adapter==='shotcraft-native';
  const comp=compositions.get(`ShotCraft-${item.slug}`);
  if(native&&!comp)throw new Error(`Missing native composition ${item.slug}`);
  const media=item.preview.mp4;
  let frames=native?Number(comp.durationInFrames):240;
  if(!native){
    const seconds=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',path.join(root,'gallery',media)],{encoding:'utf8'}));
    frames=Math.max(1,Math.floor(seconds*30));
  }
  const entry={id:item.slug,name:item.name,category:item.category,native,frames,width:native?Number(comp.width):1920,height:native?Number(comp.height):1080,poster:`previewlib/${item.preview.poster.replace('media/','')}`,media:`previewlib/${media.replace('media/','')}`};
  if(native){
    entry.props=JSON.parse(fs.readFileSync(path.join(root,item.source.sampleData)));
    entry.schema=JSON.parse(fs.readFileSync(path.join(root,item.source.schema)));
    const symbol=`Native${cards.length}`;
    imports+=`import {${comp.component} as ${symbol}} from '../../../${item.source.component.replace(/\.tsx$/,'')}';\n`;
    registry+=`${JSON.stringify(item.slug)}: ${symbol},\n`;
  }
  cards.push(entry);
}
const dest=path.join(root,'workbench/motion/src');fs.mkdirSync(dest,{recursive:true});
fs.writeFileSync(path.join(dest,'catalog.json'),JSON.stringify(cards,null,2));
fs.writeFileSync(path.join(dest,'native-registry.tsx'),`// Generated from the existing native composition declarations.\nimport type {ComponentType} from 'react';\n${imports}\nexport const nativeRegistry: Record<string,ComponentType<any>>={${registry}};\n`);
console.log(`Workbench catalog: ${cards.length} cards, ${cards.filter(c=>c.native).length} native editable templates.`);
