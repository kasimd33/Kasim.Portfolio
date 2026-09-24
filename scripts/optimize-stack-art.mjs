import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
// Delivery-format compression only; the generated source image is preserved.
const browser = await chromium.launch({channel:'chrome', headless:true});
try {
 const page = await browser.newPage();
 const source = readFileSync('public/images/stack/tech-atlas.png').toString('base64');
 const encoded = await page.evaluate(async source => {
  const image = new Image();
  image.src = `data:image/png;base64,${source}`;
  await image.decode();
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
  canvas.getContext('2d').drawImage(image,0,0);
  return canvas.toDataURL('image/webp',0.88).split(',')[1];
 }, source);
 writeFileSync('public/images/stack/tech-atlas.webp',Buffer.from(encoded,'base64'));
} finally {await browser.close();}
