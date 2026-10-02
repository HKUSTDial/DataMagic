// Keep compilation, media probing and rendering out of the editor's HTTP process.
import {exportProject} from './export.mjs';
process.once('message',async({project,kind,id,root,output,uploads})=>{
  try{
    const result=await exportProject(project,kind,id,root,output,uploads,progress=>process.send?.({type:'progress',progress}));
    process.send?.({type:'ready',result},()=>process.exit(0));
  }catch(error){process.send?.({type:'failed',error:error.message||'导出失败'},()=>process.exit(1));}
});
