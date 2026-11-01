// Dependency-free deterministic simulation of ReadyGo's browser session lifecycle.
// Run: node tests/session.cjs
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');

const html=fs.readFileSync('index.html','utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];

async function simulate({noAudio=false,stopEarly=false}={}){
 let now=0,nextId=0;
 const timers=new Map(), fetched=[], sounds=[], errors=[];
 const queue=(fn,ms=0)=>{const id=++nextId;timers.set(id,{at:now+Math.max(0,Number(ms)||0),fn});return id};
 const cancel=id=>timers.delete(id);
 async function flush(){for(let i=0;i<12;i++)await Promise.resolve()}
 async function step(ms){
  const end=now+ms;await flush();
  for(let safety=0;safety<2500;safety++){
   let first=null,firstId=null;
   for(const [id,t] of timers)if(t.at<=end&&(!first||t.at<first.at)){first=t;firstId=id}
   if(!first)break;
   now=first.at;timers.delete(firstId);first.fn();await flush();
  }
  now=end;await flush();
 }
 function el(id){
  if(elements.has(id))return elements.get(id);
  const classes=new Set();
  const x={id,disabled:false,style:{},classList:{
   add:v=>classes.add(v),remove:v=>classes.delete(v),toggle:(v,force)=>{
    if(force===undefined){classes.has(v)?classes.delete(v):classes.add(v)}
    else{force?classes.add(v):classes.delete(v)}
   }
  },textContent:'',value:id==='language'?'en':id==='length'?'10':id==='noise'?'off':'',
  getContext:()=>({}),getVideoTracks:()=>[],videoWidth:1280,videoHeight:720,
  addEventListener:()=>{},play:()=>Promise.resolve()};
  elements.set(id,x);return x;
 }
 const elements=new Map();
 let spoken=[], activeUtterance=null;
 const synth={
  speak(u){
   spoken.push(u.text);activeUtterance=u;
   queue(()=>{if(activeUtterance!==u)return;u.onstart?.();queue(()=>{
    if(activeUtterance!==u)return;
    activeUtterance=null;u.onend?.()
   },80)},1);
  },
  cancel(){
   if(activeUtterance){const u=activeUtterance;activeUtterance=null;u.onerror?.()}
  }
 };
 class AudioContext{
  constructor(){this.state='running';this.destination={}}
  get currentTime(){return now/1000}
  resume(){this.state='running';return Promise.resolve()}
  decodeAudioData(){return Promise.resolve({duration:.18})}
  createBufferSource(){
   const ctx=this;
   return {buffer:null,onended:null,connect(){},start(when){
     sounds.push({when,at:now});
     this.__id=queue(()=>{this.onended?.()},Math.ceil((when-ctx.currentTime+.18)*1000))
    },stop(){cancel(this.__id);this.onended?.()}};
  }
  getOutputTimestamp(){return {contextTime:now/1000,performanceTime:now||1}}
 }
 const win={AudioContext,webkitAudioContext:AudioContext,speechSynthesis:synth,addEventListener(){}};
 const fakeMath=Object.create(Math);fakeMath.random=()=>.99;
 const sandbox={
  document:{getElementById:el,createElement:()=>el('__scratch')},
  window:win, speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(t){this.text=t}},
  navigator:{mediaDevices:{}},requestAnimationFrame:()=>0,cancelAnimationFrame:()=>{},
  setTimeout:queue,clearTimeout:cancel,performance:{now:()=>now},
  fetch:async url=>{fetched.push(url);return {ok:!noAudio,arrayBuffer:async()=>new ArrayBuffer(60)}},
  console:{warn:(...a)=>errors.push(a.join(' ')),log:()=>{}},Math:fakeMath
 };
 vm.runInNewContext(js,sandbox,{filename:'index.html'});
 el('audioMode').onclick();
 el('length').value='10';
 el('startBtn').onclick();
 await flush();
 if(stopEarly){
  await step(200);
  el('stopBtn').onclick();
  await step(30000);
  assert.equal(el('commandText').textContent,'STOPPED');
  assert.equal(el('startBtn').disabled,false);
  assert.equal(sounds.length,0,'no GO after stop');
  return;
 }
 for(let i=0;i<1600&&el('startBtn').disabled;i++)await step(200);
 assert.equal(el('commandText').textContent,'COMPLETE','10-trial session completes');
 assert.equal(el('startBtn').disabled,false,'start re-enabled');
 assert.equal(el('validCount').textContent,10,'audio only counts completed trials');
 assert.equal(el('avgTime').textContent,'—','audio only never shows reaction times');
 assert.equal(fetched.length,19,'all 19 source recordings requested');
 assert(fetched.every(p=>!p.includes('GO08')),'GO08 not loaded');
 if(!noAudio)assert.equal(sounds.length,10,'one recorded GO per trial');
 else assert.equal(sounds.length,0,'fallback does not use empty buffers');
}
(async()=>{
 await simulate();
 await simulate({noAudio:true});
 await simulate({stopEarly:true});
 console.log('PASS: 10-trial recorded audio, browser-speech fallback, audio-only scoring, and stop cleanup');
})().catch(e=>{console.error(e);process.exitCode=1});
