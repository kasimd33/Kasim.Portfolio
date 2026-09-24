import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
mkdirSync('artifacts',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const width of [320,375,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/#stack',{waitUntil:'domcontentloaded'});
  const intro=page.locator('.portfolio-intro');await intro.waitFor({state:'visible'});
  assert.equal(await intro.locator('.box').count(),8);
  await page.locator('#main').waitFor({state:'attached'});
  assert.equal(await page.locator('#main').evaluate(el=>!!el.closest('[inert]')),true);
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===320){await page.getByRole('button',{name:'Skip intro'}).click();}

  await intro.waitFor({state:'detached',timeout:7000});
  assert.equal(await page.locator('#main').evaluate(el=>!!el.closest('[inert]')),false);
  assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
  assert.ok(await page.locator('#stack').evaluate(el=>{const rect=el.getBoundingClientRect();return rect.top>=0&&rect.top<200;}),'Hash destination should be restored');
  if(width===320)assert.equal(await page.locator('#main').evaluate(el=>document.activeElement===el),true);
  await page.waitForFunction(()=>Math.abs(document.querySelector('.navbar').getBoundingClientRect().top)<2);
  assert.deepEqual(errors,[]);await page.close();
 }
 for(const width of [375,1440]){
  const preview=await browser.newPage({viewport:{width,height:900}});
  let release;
  const hold=new Promise(resolve=>{release=resolve});
  await preview.route('**/assets/App-*.js',async route=>{await hold;await route.continue();});
  await preview.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await preview.locator('.portfolio-intro').waitFor();
  await preview.waitForTimeout(1600);
  await preview.screenshot({path:`artifacts/intro-${width}.png`});
  release();await preview.locator('.portfolio-intro').waitFor({state:'detached'});await preview.close();
 }
 const reduced=await browser.newPage({reducedMotion:'reduce'});
 await reduced.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await reduced.locator('.portfolio-intro').waitFor({state:'detached',timeout:2000});
 await reduced.getByRole('heading',{name:'SOFTWARE DEVELOPER',exact:true}).waitFor();await reduced.close();
 const delayed=await browser.newPage();
 await delayed.route('**/assets/App-*.js',async route=>{await new Promise(resolve=>setTimeout(resolve,4200));await route.continue();});
 await delayed.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await delayed.getByRole('button',{name:'Skip intro'}).click();
 await delayed.getByRole('status').filter({hasText:'Opening portfolio'}).waitFor();
 await delayed.locator('.portfolio-intro').waitFor({state:'detached',timeout:7000});await delayed.close();
 const failed=await browser.newPage();
 await failed.route('**/assets/App-*.js',route=>route.abort());
 await failed.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
 await failed.getByRole('alert').filter({hasText:'could not load'}).waitFor();
 assert.equal(await failed.getByRole('button',{name:'Reload portfolio'}).count(),1);await failed.close();
 console.log('PASS: eight-box intro, mobile/desktop layout, inert content, automatic exit, skip/focus, scroll restoration, hash links, reduced motion, slow loads, and failed-load recovery.');
}finally{await browser.close()}
