import { chromium } from '@playwright/test';
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.setContent(`<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;background:#050505;color:#f5f5f5;font-family:Arial,sans-serif;padding:64px 76px}.meta{font-size:15px;letter-spacing:4px;color:#a1a1aa}.name{font-size:94px;font-weight:700;letter-spacing:-6px;margin-top:55px}.accent{color:#d3a87c}h1{font-size:79px;font-weight:600;letter-spacing:-4px;line-height:1.05;margin:20px 0 27px}.muted{color:#a1a1aa}.bottom{border-top:1px solid #303030;padding-top:22px;margin-top:36px;font-size:19px;color:#a1a1aa}</style></head><body><div class="meta">FULL-STACK / JAVA / AI</div><div class="name">KASIM<span class="accent">.</span></div><h1>SOFTWARE<br><span class="muted">DEVELOPER</span></h1><div class="bottom">Building scalable full-stack and AI-powered applications.</div></body></html>`);
 await page.screenshot({path:'public/social-preview.png'});
}finally{await browser.close()}
