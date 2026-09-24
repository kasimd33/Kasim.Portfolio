import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
const siteUrl = process.env.MUSIC_TEST_URL || 'http://127.0.0.1:4173/';
async function instrument(context){
 await context.addInitScript(()=>{
  const NativeAudio=window.Audio;window.Audio=function(...args){const audio=new NativeAudio(...args);window.musicPlayer=audio;return audio;};
  const NativeContext=window.AudioContext;window.musicGains=[];window.musicRamps=[];
  window.AudioContext=class extends NativeContext{
   createGain(){const gain=super.createGain();const index=window.musicGains.length;window.musicGains.push(gain);const ramp=gain.gain.linearRampToValueAtTime.bind(gain.gain);gain.gain.linearRampToValueAtTime=(value,end)=>{window.musicRamps.push({index,value,duration:end-this.currentTime});return ramp(value,end);};return gain;}
  };
 });
}
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});await instrument(context);
 await context.addInitScript(()=>localStorage.setItem('kasim-music-enabled','false'));
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(siteUrl);
 const toggle=page.getByRole('button',{name:'Background music',exact:true});
 await expect(toggle).toHaveAttribute('aria-pressed','true');
 await expect.poll(()=>page.evaluate(()=>window.musicPlayer?.currentTime||0),{timeout:15000}).toBeGreaterThan(.35);
 assert.equal(await page.evaluate(()=>window.musicPlayer.loop),true);
 await expect.poll(()=>page.evaluate(()=>window.musicGains[0].gain.value)).toBeCloseTo(.12,4);
 await toggle.click();await expect(toggle).toHaveAttribute('aria-pressed','false');
 await expect.poll(()=>page.evaluate(()=>window.musicPlayer.paused)).toBe(true);
 const position=await page.evaluate(()=>window.musicPlayer.currentTime);
 assert.equal(await page.evaluate(()=>window.musicGains[0].gain.value),0);
 await toggle.click();await expect.poll(()=>page.evaluate(()=>window.musicPlayer.currentTime)).toBeGreaterThan(position+.35);
 const ramps=await page.evaluate(()=>window.musicRamps.filter(r=>r.index===0));
 assert.ok(ramps.some(r=>r.value===.12&&Math.abs(r.duration-.3)<.01));
 assert.ok(ramps.some(r=>r.value===0&&Math.abs(r.duration-.3)<.01));
 // Seek near the end to verify native looping and the loop fade without waiting for the entire song.
 await page.evaluate(()=>{window.musicPlayer.currentTime=window.musicPlayer.duration-.5;});
 await expect.poll(()=>page.evaluate(()=>window.musicPlayer.currentTime),{timeout:15000}).toBeLessThan(3);
 await expect.poll(()=>page.evaluate(()=>window.musicGains[1].gain.value)).toBeCloseTo(1,3);
 await page.screenshot({path:'artifacts/music-desktop.png'});
 await toggle.click();await page.reload();await page.locator('.portfolio-intro').waitFor({state:'detached'});
 await expect(toggle).toHaveAttribute('aria-pressed','true');
 await expect.poll(()=>page.evaluate(()=>window.musicPlayer.currentTime),{timeout:15000}).toBeGreaterThan(.35);
 assert.equal(await page.evaluate(()=>window.musicPlayer.autoplay),true);
 for(const width of [320,375,768,1024,1440]){
  await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await expect(toggle).toBeVisible();
  if(width===375)await page.screenshot({path:'artifacts/music-mobile.png'});
 }
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS: autoplay permitted, quiet gain, 300ms start/stop ramps, native loop and loop fades, autoplay after a paused reload, responsive header, no page errors.');
}finally{await browser.close();}
const restricted=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=document-user-activation-required']});
try{
 const context=await restricted.newContext({reducedMotion:'reduce'});await instrument(context);const page=await context.newPage();
 await page.goto(siteUrl);await page.locator('.portfolio-intro').waitFor({state:'detached'});
 await expect(page.getByRole('button',{name:'Background music',exact:true})).toHaveAttribute('aria-pressed','false');
 await page.locator('#hero-heading').click();
 await expect.poll(()=>page.evaluate(()=>window.musicPlayer.currentTime),{timeout:15000}).toBeGreaterThan(.3);
 console.log('PASS: restricted autoplay waits for the first interaction and then plays.');
}finally{await restricted.close();}
