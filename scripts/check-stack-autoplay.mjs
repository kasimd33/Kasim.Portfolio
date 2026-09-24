import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/#stack',{waitUntil:'networkidle'});
 const carousel=page.getByRole('region',{name:'Featured technologies'});
 await carousel.locator('.tech-cylinder').waitFor();
 await carousel.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await page.mouse.move(0,0);
 const position=()=>carousel.locator('.tech-cylinder').evaluate(el=>el.style.transform);
 const running=()=>page.waitForFunction(()=>document.querySelector('.tech-paging [role="status"]').getAttribute('aria-live')==='off');
 const stopped=async()=>{await page.waitForTimeout(200);const before=await position();await page.waitForTimeout(500);assert.equal(await position(),before)};
 await running();const initial=await position();await page.waitForTimeout(650);assert.notEqual(await position(),initial,'Should rotate automatically');
 await carousel.hover();await stopped();
 await page.mouse.move(0,0);await running();
 await carousel.focus();await stopped();
 await carousel.evaluate(el=>el.blur());await running();
 await carousel.getByRole('button',{name:'Pause automatic rotation'}).click();
 await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement.blur());await stopped();
 await carousel.getByRole('button',{name:'Resume automatic rotation'}).click();
 await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement.blur());await running();
 await carousel.hover();await stopped();
 await carousel.locator('.tech-face-active button').click();
 await page.getByRole('dialog').waitFor();await stopped();await page.keyboard.press('Escape');
 await page.evaluate(()=>document.activeElement.blur());await page.mouse.move(0,0);await running();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await stopped();
 for(const width of [320,375,768,1440]){await page.setViewportSize({width,height:1000});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`)}
 await page.emulateMedia({reducedMotion:'reduce'});await carousel.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
 await carousel.locator('.tech-stage-flat').waitFor();assert.equal(await carousel.locator('.tech-autoplay-toggle').count(),0);
 const reduced=await carousel.getByRole('status').textContent();await page.waitForTimeout(600);assert.equal(await carousel.getByRole('status').textContent(),reduced);
 await carousel.getByRole('button',{name:'Next technology'}).click();assert.notEqual(await carousel.getByRole('status').textContent(),reduced);
 assert.deepEqual(errors,[]);console.log('PASS: autoplay, hover/focus/manual/modal/offscreen pause, resume, reduced motion, responsive controls, and no page errors.');
}finally{await browser.close()}

