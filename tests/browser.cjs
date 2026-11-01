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
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
  const page=await browser.newPage();
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
  assert.deepEqual(errors,[],'no page script errors');
  console.log('PASS: Chrome loads all 19 WAVs, plays GO, advances trial, stops cleanly and retains camera UI');
 }finally{
  if(browser)await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(e=>{console.error(e);process.exitCode=1});
