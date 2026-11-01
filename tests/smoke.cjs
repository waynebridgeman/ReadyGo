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
}
assert(!fs.existsSync('audio/ref01/GO08.wav'),'excluded GO08');
assert(html.includes('visionReady)checkMovement(wrist)'),'hand landmarks required for scoring');
console.log('PASS: syntax, 19 WAV assets, GO08 exclusion, endurance options, hand-tracking guard');
