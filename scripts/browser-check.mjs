import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const base='http://127.0.0.1:4173';
const results=[];
const failures=[];
try{
 for(const width of [320,375,430,768,1024,1440,1920]){
  const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('#home').scrollIntoViewIfNeeded();
  const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,offenders:[...document.querySelectorAll('main *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.right>innerWidth+1||r.left < -1)}).map(el=>`${el.tagName}.${el.className}`).slice(0,10)}));
  assert.ok(overflow.scroll<=overflow.client,`${width}px overflow: ${JSON.stringify(overflow)}`);
  assert.equal(await page.locator('canvas').count(),0,'Reduced motion must not create a canvas');
  await page.getByRole('button',{name:'Download resume'}).click();
  await page.getByRole('status').filter({hasText:'resume will be available'}).waitFor();
  await page.getByRole('button',{name:'View details for ROADLENS'}).click();
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.getByRole('dialog').getByRole('heading',{name:'ROADLENS',exact:true}).count(),1);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').isVisible(),false);
  assert.equal(await page.getByRole('button',{name:'View details for ROADLENS'}).evaluate(el=>document.activeElement===el),true);
  if(width<=768){
   await page.getByRole('button',{name:'Open navigation'}).click();
   await page.getByRole('navigation').getByRole('link',{name:'Contact'}).click();
   assert.equal(await page.getByRole('button',{name:'Open navigation'}).getAttribute('aria-expanded'),'false');
  }
  await page.getByRole('button',{name:'Prepare email'}).click();
  await page.getByText('Please enter your name (at least 2 characters).',{exact:true}).waitFor();
  assert.equal(await page.locator('#name').evaluate(el=>el===document.activeElement),true);
  await page.getByLabel('Your name').fill('Hiring team');
  await page.getByLabel('Email address').fill('recruiter@example.com');
  await page.getByLabel('What do you have in mind?').fill('Let us discuss a software developer opportunity.');
  await page.getByRole('button',{name:'Prepare email'}).click();
  await page.getByRole('status').filter({hasText:'Your message has not been sent.'}).waitFor();
  for(const image of await page.locator('img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(el=>el.decode());}
  const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));
  assert.deepEqual(broken,[]);
  const a11y=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  if(a11y.violations.length)failures.push({width,violations:a11y.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  assert.deepEqual(errors,[],`Console/network errors at ${width}`);
  await page.evaluate(()=>window.scrollTo(0,0));
  if([375,1440].includes(width))await page.screenshot({path:`artifacts/portfolio-${width}.png`,fullPage:true});
  results.push({width,overflow:false,brokenImages:0,consoleErrors:0,accessibilityViolations:a11y.violations.length});
  await context.close();
 }
 const desktop=await browser.newPage({viewport:{width:1440,height:1000}});
 const desktopErrors=[];
 desktop.on('pageerror',e=>desktopErrors.push(e.message));
 await desktop.goto(base,{waitUntil:'networkidle'});
 await desktop.locator('canvas').waitFor();
 await desktop.waitForTimeout(1600);
 await desktop.screenshot({path:'artifacts/hero-desktop.png'});
 assert.deepEqual(desktopErrors,[]);
 await desktop.locator('canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
 await desktop.locator('.scene-fallback').waitFor();
 assert.equal(await desktop.locator('canvas').count(),0);
 await desktop.close();
 const mobile=await browser.newPage({viewport:{width:375,height:812}});
 const requested=[];
 mobile.on('request',r=>requested.push(r.url()));
 await mobile.goto(base,{waitUntil:'networkidle'});
 assert.equal(await mobile.locator('canvas').count(),0);
 assert.ok(!requested.some(url=>/\/(?:three|HeroScene|animations)-[^/]+\.js/.test(url)),'Mobile should not download Three.js or GSAP');
 await mobile.close();
 writeFileSync('artifacts/browser-results.json',JSON.stringify({results,failures,webgl:'rendered; context-loss fallback verified',mobile:'no Three.js download'},null,2));
 console.log(JSON.stringify({results,failures},null,2));
 assert.deepEqual(failures,[],'Accessibility violations found');
}finally{await browser.close()}




