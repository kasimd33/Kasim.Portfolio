import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = 'http://127.0.0.1:4173/';
async function ready(page) {
  await page.locator('.portfolio-intro').waitFor({ state: 'detached', timeout: 12000 });
}
async function atHero(page) {
  await ready(page);
  await expect(page).toHaveURL(/#home$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect.poll(() => page.evaluate(() => history.scrollRestoration)).toBe('auto');
  await expect(page.locator('#main')).not.toHaveAttribute('inert');
  assert.equal(await page.locator('#main').evaluate(el => !!el.closest('[inert]')), false);
}
async function atSection(page, id) {
  await expect.poll(() => page.locator('#' + id).evaluate(el => Math.round(el.getBoundingClientRect().top))).toBeGreaterThanOrEqual(0);
  await expect.poll(() => page.locator('#' + id).evaluate(el => Math.abs(el.getBoundingClientRect().top - parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)))).toBeLessThan(2);
  // Let the browser commit its final smooth-scroll position before history traversal.
  await page.waitForTimeout(300);
}
try {
  for (const scenario of [
    { width: 1440, reducedMotion: 'no-preference', hash: 'about', skip: false },
    { width: 375, reducedMotion: 'no-preference', hash: 'contact', skip: true },
    { width: 1440, reducedMotion: 'reduce', hash: 'projects', skip: false },
  ]) {
    const page = await browser.newPage({ viewport: { width: scenario.width, height: 900 }, reducedMotion: scenario.reducedMotion });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '?view=portfolio#' + scenario.hash);
    await ready(page); await atSection(page, scenario.hash);
    await page.reload({ waitUntil: 'domcontentloaded' });
    if (scenario.skip) await page.getByRole('button', { name: 'Skip intro' }).click();
    await atHero(page);
    assert.equal(new URL(page.url()).search, '?view=portfolio');
    await page.getByRole('link', { name: 'View projects', exact: true }).click();
    await atSection(page, 'projects');
    if (scenario.width < 769) await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.locator('.navbar a[href="#contact"]').click();
    await atSection(page, 'contact');
    await page.goBack(); await atSection(page, 'projects');
    await page.goForward(); await atSection(page, 'contact');
    // A second reload must still reset to the hero after normal in-page navigation.
    await page.reload(); await atHero(page);
    assert.deepEqual(errors, []);
    await page.close();
  }
  const plain = await browser.newPage({ reducedMotion: 'reduce' });
  await plain.goto(base); await ready(plain);
  await plain.locator('#about').scrollIntoViewIfNeeded();
  assert.ok(await plain.evaluate(() => scrollY > 0));
  await plain.reload(); await atHero(plain); await plain.close();
  const delayed = await browser.newPage({ reducedMotion: 'reduce' });
  await delayed.goto(base + '#about'); await ready(delayed);
  await delayed.route('**/assets/App-*.js', async route => {
    await new Promise(resolve => setTimeout(resolve, 1500)); await route.continue();
  });
  await delayed.reload({ waitUntil: 'domcontentloaded' }); await atHero(delayed); await delayed.close();
  console.log('PASS: reloads from sections and manual scrolling land at hero; intro/skip, mobile, reduced motion, slow loading, direct links, navigation, Back/Forward, query preservation.');
} finally { await browser.close(); }
