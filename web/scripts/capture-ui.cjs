const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const dir=path.resolve(__dirname,'../../docs/screenshots');fs.mkdirSync(dir,{recursive:true});
 const desktop=await browser.newContext({viewport:{width:1440,height:940},deviceScaleFactor:1});
 const page=await desktop.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
 await page.locator('#analyze-page.active').waitFor();
 await page.locator('[data-target="home-page"]').click();
 await page.locator('#home-page.active').waitFor();
 await page.screenshot({path:path.join(dir,'overview-desktop.png'),fullPage:true,animations:'disabled'});
 await page.locator('[data-target="analyze-page"]').click();
 const data=await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=800;c.height=1200;
  const g=c.getContext('2d'),grad=g.createLinearGradient(0,0,800,1200);
  grad.addColorStop(0,'#08121a');grad.addColorStop(.55,'#182934');grad.addColorStop(1,'#09131b');
  g.fillStyle=grad;g.fillRect(0,0,800,1200);
  g.globalAlpha=.21;g.fillStyle='#809aa2';g.beginPath();g.ellipse(400,595,235,505,0,0,Math.PI*2);g.fill();g.globalAlpha=1;
  g.strokeStyle='#718991';g.lineWidth=9;g.beginPath();g.moveTo(410,140);g.bezierCurveTo(280,350,490,530,365,1080);g.stroke();
  for(let i=0;i<17;i++){
   const y=180+i*49, x=393-36*Math.sin(i*.5)+9*Math.sin(i*.12);
   g.save();g.translate(x,y);g.rotate(Math.sin(i*.5)*.2);
   g.fillStyle=i%2?'#83979c':'#a2b1b6';g.strokeStyle='#42545e';g.lineWidth=4;
   g.fillRect(-74,-17,148,34);g.strokeRect(-74,-17,148,34);g.fillStyle='#13232b';g.fillRect(-13,-17,26,34);g.restore();
  }
  g.fillStyle='#0d2530';g.fillRect(16,24,768,80);g.fillStyle='#efbd85';g.font='bold 24px sans-serif';g.fillText('SYNTHETIC TEST FIXTURE',42,64);
  g.fillStyle='#d3e2dd';g.font='18px sans-serif';g.fillText('NOT PATIENT RADIOGRAPH / UI TEST ONLY',42,93);
  g.fillStyle='#0b2530';g.fillRect(16,1119,768,56);g.fillStyle='#bed6c9';g.fillText('SCOLIOVISION · REPRODUCIBLE EXAMPLE',43,1155);
  return c.toDataURL('image/png');
 });
 const buffer=Buffer.from(data.split(',')[1],'base64');
 await page.locator('#file-input').setInputFiles({name:'synthetic-test-fixture.png',mimeType:'image/png',buffer});
 await page.locator('#preview-area').waitFor({state:'visible'});
 const picks=[[.33,.34],[.62,.37],[.30,.75],[.64,.69]];
 for(const [x,y] of picks){await page.locator('#measurement-overlay').evaluate((el,pt)=>{const r=el.getBoundingClientRect();el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.x+r.width*pt[0],clientY:r.y+r.height*pt[1]}))},[x,y])}
 assert.equal((await page.locator('#point-count').textContent()).trim(),'4 / 4');
 await page.locator('#analyze-btn').click();
 await page.locator('#result-area').waitFor({state:'visible'});
 assert.match(await page.locator('#result-mode').textContent(),/MANUAL/);
 await page.screenshot({path:path.join(dir,'measurement-desktop.png'),fullPage:true,animations:'disabled'});
 // Verify dragging invalidates result and JSON can be loaded back
 const b=await page.locator('#measurement-overlay').boundingBox();
 await page.mouse.move(b.x+b.width*.33,b.y+b.height*.34);await page.mouse.down();
 await page.mouse.move(b.x+b.width*.33+10,b.y+b.height*.34+12,{steps:3});await page.mouse.up();
 assert.equal(await page.locator('#result-area').isVisible(),false);
 await page.locator('#analyze-btn').click();
 const [dl]=await Promise.all([page.waitForEvent('download'),page.locator('#export-json').click()]);
 const saved=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));assert.equal(saved.schema,'scoliovision.measurement.v1');
 await page.locator('#clear-points').click();
 await page.locator('#import-json-file').setInputFiles({name:'saved.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
 await page.waitForFunction(() => document.getElementById('point-count').textContent.trim() === '4 / 4',{timeout:10000});
 assert.deepEqual(errors,[]);
 // Mobile: actual responsive layout with synthetic fixture and manually marked angle
 const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const m=await mobile.newPage();const mobileErrors=[];m.on('pageerror',e=>mobileErrors.push(e.message));
 await m.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
 await m.locator('[data-target="analyze-page"]').click();
 await m.locator('#file-input').setInputFiles({name:'synthetic-test-fixture.png',mimeType:'image/png',buffer});
 await m.locator('#preview-area').waitFor({state:'visible'});
 await m.waitForFunction(() => {
   const svg=document.getElementById('measurement-overlay'), img=document.getElementById('preview-img');
   return svg.getAttribute('viewBox') && img.naturalWidth > 0 && svg.getBoundingClientRect().height>0;
 },null,{timeout:10000});
 console.log('MOBILE VIEW:',await m.evaluate(()=>{
   const svg=document.getElementById('measurement-overlay'),r=svg.getBoundingClientRect();
   return {viewBox:svg.getAttribute('viewBox'),rect:{x:r.x,y:r.y,width:r.width,height:r.height},mode:document.getElementById('analysis-mode').value,display:getComputedStyle(svg).display,pointer:getComputedStyle(svg).pointerEvents};
 }));
 for(const xy of picks){await m.locator('#measurement-overlay').evaluate((el,pt)=>{const r=el.getBoundingClientRect();el.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.x+r.width*pt[0],clientY:r.y+r.height*pt[1]}))},xy)}
 assert.equal((await m.locator('#point-count').textContent()).trim(),'4 / 4');
 await m.locator('#analyze-btn').click();await m.locator('#result-area').waitFor({state:'visible'});
 await m.screenshot({path:path.join(dir,'measurement-mobile.png'),fullPage:true,animations:'disabled'});
 assert.deepEqual(mobileErrors,[]);
 await browser.close();
 console.log('Screenshot smoke tests passed: actual desktop/mobile UI, drag, exported JSON, restored points');
})().catch(e=>{console.error(e);process.exit(1)});
