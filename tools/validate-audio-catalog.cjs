// ReadyGo audio-catalog validation. Node.js 22+. No external packages.
// Run: node tools/validate-audio-catalog.cjs
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const catalogPath=path.join(root,'audio','catalog.json');
const catalog=JSON.parse(fs.readFileSync(catalogPath,'utf8'));
assert.equal(catalog.schemaVersion,1,'Supported catalog schema version');
assert(Array.isArray(catalog.referees)&&catalog.referees.length>0,'Referees exist');
assert(Array.isArray(catalog.commandVocabulary),'Command vocabulary exists');
const vocab=new Set(catalog.commandVocabulary.map(x=>x.code));
assert(vocab.has('GO')&&vocab.has('READY')&&vocab.has('SET'),'Minimum vocabulary supported');
const refereeIds=new Set(),recordingIds=new Set(),filePaths=new Set();
let total=0,go=0;
const errors=[];
function checkWav(file){
 const buf=fs.readFileSync(file);
 assert(buf.length>44,'Nonempty WAV');
 assert.equal(buf.toString('ascii',0,4),'RIFF','RIFF header');
 assert.equal(buf.toString('ascii',8,12),'WAVE','WAVE header');
 let format=null,data=null;
 for(let p=12;p+8<=buf.length;){
  const name=buf.toString('ascii',p,p+4),len=buf.readUInt32LE(p+4);
  assert(p+8+len<=buf.length,'WAV chunk is in bounds');
  if(name==='fmt '){
   assert(len>=16,'PCM format chunk');
   format={codec:buf.readUInt16LE(p+8),channels:buf.readUInt16LE(p+10),rate:buf.readUInt32LE(p+12),depth:buf.readUInt16LE(p+22)};
  }
  if(name==='data')data={start:p+8,len};
  p+=8+len+(len%2);
 }
 assert.deepEqual(format,{codec:1,channels:1,rate:48000,depth:16},'48 kHz, mono, 16-bit PCM');
 assert(data&&data.len>4000,'Audio data exists');
 let peak=0;
 for(let p=data.start;p+1<data.start+data.len;p+=2)peak=Math.max(peak,Math.abs(buf.readInt16LE(p)));
 assert(peak>500,'Non-silent cue');
 assert(peak<32760,'No digital full-scale clipping');
 return {durationMs:Math.round(data.len/2/48000*1000),peak};
}
for(const ref of catalog.referees){
 assert(/^[A-Z0-9_-]+$/.test(ref.id),'Valid referee ID');
 assert(!refereeIds.has(ref.id),'Unique referee ID');refereeIds.add(ref.id);
 assert(['active','developing','archived'].includes(ref.status),'Known referee status');
 assert(Array.isArray(ref.recordings),'Recordings must be an array');
 for(const take of ref.recordings){
  total++;
  try{
   assert(/^[A-Z0-9_-]+$/.test(take.id),'Valid recording ID');
   assert(!recordingIds.has(take.id),'Unique recording ID');recordingIds.add(take.id);
   assert(vocab.has(take.command),'Known command');
   assert(['estimated','waveform-reviewed','acoustically-calibrated','none'].includes(take.onsetQuality),'Onset quality');
   assert(['provisional','approved','rejected'].includes(take.qaStatus),'QA status');
   assert(Number.isFinite(take.onsetMs)&&take.onsetMs>=0&&take.onsetMs<=1000,'Onset offset in ms');
   assert(typeof take.file==='string'&&/^[a-z0-9_-]+\/[A-Za-z0-9_-]+\.wav$/.test(take.file),'Safe relative WAV path');
   const full=path.resolve(root,'audio',take.file);
   assert(full.startsWith(path.join(root,'audio')+path.sep),'WAV inside audio directory');
   assert(!filePaths.has(full),'Unique filename');filePaths.add(full);
   const stats=checkWav(full);
   assert(take.onsetMs<stats.durationMs,'Onset inside clip');
   if(take.command==='GO')go++;
  }catch(error){errors.push(ref.id+' / '+take.id+': '+error.message)}
 }
}
for(const e of errors)console.error('FAIL',e);
assert.equal(errors.length,0,'Catalog contains invalid clips');
const baseline=catalog.referees.find(r=>r.id==='REF01');
assert(baseline,'REF01 baseline present');
const expected=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20];
for(const n of expected){
 const id='REF01_GO_'+String(n).padStart(2,'0');
 assert(baseline.recordings.some(t=>t.id===id&&t.command==='GO'),'Baseline clip '+id+' preserved');
}
assert(total>=19,'Catalog includes complete baseline');
assert(go>=19,'Catalog includes 19 GO triggers');
assert(![...filePaths].some(s=>s.endsWith('/GO08.wav')),'Excluded And GO recording');
console.log('PASS: catalog '+refereeIds.size+' referee(s), '+total+' valid recorded takes, '+go+' GO triggers; PCM, path and onset checks');
