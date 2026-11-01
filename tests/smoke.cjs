// Run: node tests/smoke.cjs
const fs = require('node:fs');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const html = fs.readFileSync('index.html','utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert(script,'inline app script exists');
new vm.Script(script,{filename:'index.html'});
const ids=[...html.matchAll(/const REF01_IDS=\[([^\]]+)\]/g)].map(m=>m[1].split(',').map(Number));
assert.equal(ids.length,1,'one REF01 audio pool');
assert.deepEqual(ids[0],[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20]);
for(let n=10;n<=100;n+=10)assert(html.includes(`<option value="${n}"`),`session length ${n}`);
for(const name of ids[0].map(n=>`GO${String(n).padStart(2,'0')}.wav`)){
 const p=`audio/ref01/${name}`;
 assert(fs.existsSync(p),`missing ${p}`);
 const b=fs.readFileSync(p);
 assert.equal(b.toString('ascii',0,4),'RIFF',`RIFF ${p}`);
 assert.equal(b.toString('ascii',8,12),'WAVE',`WAVE ${p}`);
 assert(b.length>44,`nonempty audio ${p}`);
 let fmt=null,dataOffset=-1,dataBytes=0;
 for(let offset=12;offset+8<=b.length;){
  const type=b.toString('ascii',offset,offset+4);
  const bytes=b.readUInt32LE(offset+4);
  if(type==='fmt '){fmt={
   codec:b.readUInt16LE(offset+8),
   channels:b.readUInt16LE(offset+10),
   sampleRate:b.readUInt32LE(offset+12),
   sampleBits:b.readUInt16LE(offset+22)
  }}
  if(type==='data'){dataOffset=offset+8;dataBytes=bytes;break}
  offset+=8+bytes+(bytes%2);
 }
 assert(fmt,`missing WAV format chunk ${p}`);
 assert.deepEqual(fmt,{codec:1,channels:1,sampleRate:48000,sampleBits:16},`PCM mono 48kHz 16bit ${p}`);
 assert(dataOffset>0&&dataBytes>1000&&dataOffset+dataBytes<=b.length,`valid audio data ${p}`);
 let peak=0;
 for(let pos=dataOffset;pos+1<dataOffset+dataBytes;pos+=2)peak=Math.max(peak,Math.abs(b.readInt16LE(pos)));
 assert(peak>500,`silent recording ${p}`);
 assert(peak<32760,`clipped recording ${p}`);
}
assert(!fs.existsSync('audio/ref01/GO08.wav'),'excluded GO08');
assert(html.includes('visionReady)checkMovement(wrist)'),'hand landmarks required for scoring');
console.log('PASS: syntax, 19 PCM mono WAVs/no clipping, GO08 exclusion, endurance options, hand-tracking guard');
