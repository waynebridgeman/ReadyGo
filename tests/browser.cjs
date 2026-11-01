// Headless Chromium integration check. Requires npm install (Playwright).
// Uses the Chrome browser supplied by the GitHub-hosted runner.
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+pathname.replace(/\/$/,'/index.html'));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  const content=fs.readFileSync(file);
  res.writeHead(200,{'Content-Type':file.endsWith('.wav')?'audio/wav':file.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream'});
  res.end(content);
 }catch(e){res.writeHead(404).end('Not found')}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try{
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
  const page=await browser.newPage();
  await page.route('**/@mediapipe/tasks-vision@0.10.14/+esm',route=>route.fulfill({
   status:200,contentType:'application/javascript',
   headers:{'Access-Control-Allow-Origin':'*'},
   body:`export const FilesetResolver={forVisionTasks:async()=>({})};
export const HandLandmarker={createFromOptions:async()=>({
 detectForVideo:()=>({landmarks:[Array.from({length:21},()=>({
  x:globalThis.__handPosition?.x??.5,y:globalThis.__handPosition?.y??.5
 }))]})
})};`
  }));
  const wavResponses=[];
  page.on('response',res=>{if(res.url().endsWith('.wav'))wavResponses.push({url:res.url(),status:res.status()})});
  await page.addInitScript(()=>{
   window.__goStarts=0;
   const original=AudioBufferSourceNode.prototype.start;
   AudioBufferSourceNode.prototype.start=function(...args){window.__goStarts++;return original.apply(this,args)};
   class StubUtterance{constructor(text){this.text=text}}
   window.SpeechSynthesisUtterance=StubUtterance;
   let active=null;
   Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
    speak(u){
     active=u;
     setTimeout(()=>{if(active!==u)return;u.onstart?.();setTimeout(()=>{if(active!==u)return;active=null;u.onend?.()},60)},5);
    },
    cancel(){if(active){const u=active;active=null;u.onerror?.()}}
   }});
  });
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'load'});
  assert.equal(await page.locator('#cameraBtn').count(),1,'Camera Mode preserved');
  await page.locator('#audioMode').click();
  await page.locator('#startBtn').click();
  await page.waitForFunction(()=>window.__goStarts>0,{timeout:20000});
  await page.waitForFunction(()=>document.querySelector('#commandText').textContent==='GO',{timeout:3000});
  assert.equal(await page.locator('#avgTime').textContent(),'—','Audio-only does not measure reaction time');
  assert.equal(wavResponses.length,19,'all referee files fetched');
  assert(wavResponses.every(x=>x.status===200),'all referee files served successfully');
  await page.waitForFunction(()=>document.querySelector('#trialBadge').textContent.includes('TRIAL 2'),{timeout:12000});
  await page.locator('#stopBtn').click();
  assert.equal(await page.locator('#commandText').textContent(),'STOPPED');
  await page.waitForTimeout(2700);
  assert.equal(await page.locator('#commandText').textContent(),'STOPPED','stop cancels queued next trial');
  await page.locator('#cameraMode').click();
  assert.equal(await page.locator('#cameraBtn').isVisible(),true,'camera controls restored');
  // Simulated hand landmarks exercise the actual camera-session scoring paths.
  await page.evaluate(()=>window.__handPosition={x:.5,y:.5});
  await page.locator('#cameraBtn').click();
  await page.waitForFunction(()=>document.querySelector('#trackingBadge').textContent.includes('HAND LANDMARKS'),null,{timeout:10000});
  await page.waitForTimeout(300);
  await page.locator('#calibrateBtn').click();
  await page.locator('#startBtn').click();
  await page.waitForFunction(()=>document.querySelector('#trialBadge').textContent.includes('TRIAL 1'),null,{timeout:4000});
  await page.evaluate(()=>window.__handPosition={x:.9,y:.5});
  await page.waitForFunction(()=>document.querySelector('#falseCount').textContent==='1',null,{timeout:4000});
  assert.equal(await page.locator('#stateText').textContent(),'FALSE START');
  await page.locator('#stopBtn').click();
  await page.evaluate(()=>window.__handPosition={x:.5,y:.5});
  await page.locator('#startBtn').click();
  await page.waitForFunction(()=>document.querySelector('#stateText').textContent==='GO',null,{timeout:15000});
  await page.evaluate(()=>window.__handPosition={x:.9,y:.5});
  await page.waitForFunction(()=>document.querySelector('#validCount').textContent==='1',null,{timeout:4000});
  assert.match(await page.locator('#avgTime').textContent(),/ms$/,'camera reports approximate reaction time');
  await page.locator('#stopBtn').click();
  await page.locator('#audioMode').click();
  assert.equal(await page.locator('#cameraBtn').isVisible(),false,'audio-only hides camera controls');
  assert.deepEqual(errors,[],'no page script errors');
  // Contributor recording studio: microphone capture, review, ZIP export and local privacy.
  const recorderContext=await browser.newContext({permissions:['microphone'],acceptDownloads:true});
  const studio=await recorderContext.newPage();
  const studioErrors=[];
  studio.on('pageerror',e=>studioErrors.push(e.message));
  await studio.goto('http://127.0.0.1:'+server.address().port+'/recorder/',{waitUntil:'load'});
  assert.equal(await studio.locator('#promptText').textContent(),'GO!','default recording prompt');
  await studio.locator('#consent').check();
  await studio.locator('#start').click();
  await studio.waitForFunction(()=>!document.querySelector('#stop').disabled,null,{timeout:10000});
  await studio.waitForTimeout(650);
  await studio.locator('#stop').click();
  await studio.waitForFunction(()=>document.querySelector('#count').textContent.includes('1 saved take'),null,{timeout:10000});
  assert.equal(await studio.locator('#clips audio').count(),1,'reviewable audio is captured');
  const [saved]=await Promise.all([studio.waitForEvent('download',{timeout:10000}),studio.locator('#downloadAll').click()]);
  const zipped=fs.readFileSync(await saved.path());
  assert.equal(zipped.readUInt32LE(0),0x04034b50,'ZIP signature');
  assert(zipped.includes(Buffer.from('REF02_GO_take01.')),'recorded take in exported ZIP');
  assert(zipped.includes(Buffer.from('batch_manifest.json')),'batch metadata in exported ZIP');
  assert.deepEqual(studioErrors,[],'recorder browser has no script errors');
  await recorderContext.close();
  console.log('PASS: Chrome REF01 playback, camera simulation and local microphone recording studio ZIP export');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(e=>{console.error(e);process.exitCode=1});
