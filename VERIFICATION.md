# Verification — 22 September 2026

- `npm install`: completed; audited dependencies reported zero vulnerabilities.
- `npm run build`: passed. The optional, lazy-loaded Three.js chunk emits Vite's bundle-size advisory (about 256 KB gzip); it is excluded from mobile/reduced-motion downloads.
- `npm run lint`: passed.
- `npm test`: all three behavior/configuration checks passed.
- Chrome/Playwright: checked widths 320, 375, 430, 768, 1024, 1440, and 1920px. No horizontal overflow, missing images, page errors, or failed asset requests. Project dialogs, Escape/focus restoration, mobile navigation, resume notice, validation, and honest contact status passed.
- axe WCAG A/AA checks: zero violations at all seven widths after correcting a desktop metadata label's contrast.
- WebGL scene rendered. Simulated context loss activated the static fallback. Mobile did not request the scene or animation bundles.
- Local Lighthouse mobile run: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**. FCP 1.4s, LCP 1.8s, TBT 180ms, CLS 0.003. These are local lab results, not guaranteed deployed scores.
- Screenshots and machine-readable results are saved in ignored `artifacts/`.

Personal data still needed: resume PDF; GitHub/LinkedIn/email; repository/demo URLs; education details; confirmed experience and credential details. Optional real project screenshots can replace the labeled concept diagrams. No deployment was performed.

## Tech-stack carousel update

- Moved the stack directly after the hero; "Scroll to explore" now targets it.
- Added the supplied cylinder carousel as a typed, reusable component with AI-generated technology artwork.
- `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` pass.
- `node scripts/check-stack.mjs` passed at 320, 375, 430, 768, 1024, 1440, and 1920px: no horizontal overflow, page/network errors, or detected WCAG A/AA issues in the stack. Previous/next, keyboard Home/End, drag, detail dialogs, Escape/focus restoration, and a full reduced-motion cycle passed.
- Original PNG: `public/images/stack/tech-atlas.png`. Served WebP: `public/images/stack/tech-atlas.webp` (82,502 bytes). Exact prompt and provenance: `public/images/stack/ARTWORK.md`.
- New carousel code loads on approach to the stack. Initial application JavaScript remains about 70 KB gzip. The earlier Lighthouse score is a baseline from before this carousel update and has not been remeasured for the new feature.

## Loading intro update

- Added the supplied eight-box animation before the portfolio, with a dark-theme palette and scoped CSS.
- TypeScript, lint, and the production build pass.
- `node scripts/check-intro.mjs` passes: 320/375/1440px layouts, eight boxes, hidden/inert content, automatic exit, skip with focus restoration, scroll unlocking, hash destinations, reduced motion, slow app downloads, and a failed-download reload action.
- Desktop and mobile screenshots are in `artifacts/intro-1440.png` and `artifacts/intro-375.png`.
- The requested intro adds a three-second decorative cycle on full page loads (skippable; no delay for reduced motion). Earlier Lighthouse scores predate this change and are not measurements of the new intro.
