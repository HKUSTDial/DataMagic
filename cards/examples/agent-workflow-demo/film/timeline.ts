export const FPS=30;
export const SHOTS=[
 {id:'result',from:0,duration:120,title:'从一份表，到一支视频'},
 {id:'gallery',from:120,duration:300,title:'01  选中你想要的效果'},
 {id:'copy',from:420,duration:150,title:'02  复制实现指令'},
 {id:'prompt',from:570,duration:300,title:'03  把数据与要求交给智能体'},
 {id:'execute',from:870,duration:180,title:'读取配方 → 校验数据 → 渲染'},
 {id:'first',from:1050,duration:240,title:'第一版 · 实际输出摘录'},
 {id:'revise',from:1290,duration:240,title:'04  继续对话，修改效果'},
 {id:'final',from:1530,duration:420,title:'修改版 · 完整 14 秒'},
 {id:'deliver',from:1950,duration:210,title:'效果看得见，源码也留下'},
] as const;
export const TOTAL=2160;
export const SFX=[
 {from:SHOTS[2].from+40,src:'click.wav',duration:8,volume:.5},
 {from:SHOTS[3].from+210,src:'click.wav',duration:8,volume:.35},
 {from:SHOTS[6].from+185,src:'click.wav',duration:8,volume:.35},
 {from:SHOTS[1].from,src:'whoosh.wav',duration:18,volume:.2},
 {from:SHOTS[7].from,src:'whoosh.wav',duration:18,volume:.2},
];
