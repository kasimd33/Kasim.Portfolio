import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
const siteUrl = process.env.MUSIC_TEST_URL || 'http://127.0.0.1:4173/';
async function instrument(context) {
  await context.addInitScript(() => {
    const NativeAudio = window.Audio;
    window.Audio = function (...args) { return window.musicPlayer = new NativeAudio(...args); };
    const NativeContext = window.AudioContext;
    window.musicGains = [];
    window.AudioContext = class extends NativeContext {
      constructor(...args) { super(...args); window.musicContext ??= this; }
      createGain() { const gain = super.createGain(); window.musicGains.push(gain); return gain; }
    };
  });
}
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  await instrument(context);
  await context.addInitScript(() => { AudioParam.prototype.cancelAndHoldAtTime = undefined; });
  const page = await context.newPage();
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(siteUrl);
  const toggle = page.getByRole('button', { name: 'Background music', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(() => page.evaluate(() => window.musicGains[0].gain.value)).toBeCloseTo(.12, 4);
  await toggle.click();
  await expect.poll(() => page.evaluate(() => window.musicPlayer.paused)).toBe(true);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  // An OS/audio interruption must change the UI and recover on the next gesture.
  await page.evaluate(() => window.musicContext.suspend());
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  await expect.poll(() => page.evaluate(() => window.musicContext.state)).toBe('running');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  assert.deepEqual(errors, []);
  await context.close();
  console.log('PASS: missing fade API fallback, quiet playback, pause/resume, context interruption recovery.');

  const slow = await browser.newContext({ reducedMotion: 'reduce' });
  await instrument(slow);
  let releaseAudio;
  const audioGate = new Promise(resolve => { releaseAudio = resolve; });
  await slow.route('**/audio/acceptance-relaxdaily.mp3', async route => { await audioGate; await route.continue(); });
  const slowPage = await slow.newPage();
  await slowPage.goto(siteUrl, { waitUntil: 'domcontentloaded' });
  await slowPage.locator('.portfolio-intro').waitFor({ state: 'detached' });
  const slowToggle = slowPage.getByRole('button', { name: 'Background music', exact: true });
  await expect(slowToggle).toHaveAttribute('aria-pressed', 'false');
  await slowToggle.click();
  releaseAudio();
  await expect(slowToggle).toHaveAttribute('aria-pressed', 'true', { timeout: 20000 });
  await expect.poll(() => slowPage.evaluate(() => window.musicPlayer.currentTime), { timeout: 15000 }).toBeGreaterThan(.3);
  await slow.close();
  console.log('PASS: slow audio does not show false playback; first music-button click starts instead of cancelling.');
} finally { await browser.close(); }

const restricted = await chromium.launch({ channel: 'chrome', headless: true, args: ['--autoplay-policy=document-user-activation-required'] });
try {
  for (const gesture of ['touch', 'keyboard', 'music button']) {
    const context = await restricted.newContext({ reducedMotion: 'reduce', hasTouch: gesture === 'touch', viewport: { width: 390, height: 844 } });
    await instrument(context);
    const page = await context.newPage();
    await page.goto(siteUrl);
    await page.locator('.portfolio-intro').waitFor({ state: 'detached' });
    const toggle = page.getByRole('button', { name: 'Background music', exact: true });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    if (gesture === 'touch') await page.locator('#hero-heading').tap();
    else if (gesture === 'keyboard') await page.keyboard.press('Tab');
    else await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true', { timeout: 15000 });
    await expect.poll(() => page.evaluate(() => window.musicGains[0].gain.value)).toBeCloseTo(.12, 4);
    await expect.poll(() => page.evaluate(() => window.musicPlayer.currentTime)).toBeGreaterThan(.3);
    await toggle.click();
    await expect.poll(() => page.evaluate(() => window.musicPlayer.paused)).toBe(true);
    await page.locator('#hero-heading').click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    assert.equal(await page.evaluate(() => window.musicPlayer.paused), true);
    await context.close();
    console.log(`PASS: restricted autoplay recovers on ${gesture}; intentional pause stays paused.`);
  }
} finally { await restricted.close(); }
