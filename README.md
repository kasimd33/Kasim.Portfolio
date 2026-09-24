# Kasim — Software Developer Portfolio

A responsive React portfolio with a monochrome editorial design, a transparent portrait hero with perspective tilt and a soft gold outline, project detail dialogs, accessible navigation, and a validated email-draft form. Prepared for Vercel. No backend, API keys, remote fonts, stock assets, or external 3D model requests are needed.

## Local development

Use Node.js 22.12+ (Node 24 recommended).

```sh
npm install
npm run dev
```

Open the URL printed by Vite. To verify production:

```sh
npm run lint
npm test
npm run build
npm run preview
```

`npm ci` reproduces the committed dependency lockfile. On a restricted Windows environment, `npm install --cache .npm-cache` keeps the npm cache within this project.

## Structure

```text
src/
  components/    Navbar, Hero, About, Projects, ProjectCard, Skills,
                 Experience, Certifications, Contact, Footer, Shared
  three/         HeroScene, FloatingObjects, SceneLoader
  data/          portfolio.js — all owner content and external links
  hooks/         useMediaQuery.js
  lib/           contact.js and animations.js — validation, mailto, scoped motion
  styles/        index.css — tokens, typography, layout, motion, breakpoints
  App.jsx        composition and scoped GSAP animation lifecycle
  main.jsx       React root and locally bundled font
public/
  projects/      five editable SVG concept diagrams
  images/        optional screenshots
  models/        reserved; no models needed
  resume/        place Kasim-Resume.pdf here
  favicon.svg
  social-preview.png
scripts/         diagram generator and browser verification
tests/          contact behavior and configured asset checks
```

## Personalize before publishing

Edit **src/data/portfolio.js**:

- Set `links.github`, `links.linkedin`, and `links.email` (email address only, without `mailto:`).
- Add **public/resume/Kasim-Resume.pdf**, then set `resumeAvailable: true`. The download control is enabled for the supplied resume PDF.
- Set each project's `github` and `demo`. Each project uses its repository URL when provided, otherwise the GitHub profile at links.github. The detail dialog shows an overview, diagram, features, technology stack, and source links. Never use `#` as a dummy external URL.
- Replace concept diagrams with real screenshots in **public/projects/** or **public/images/**. Update `image` and `imageAlt`. Prefer compressed WebP/AVIF, about 1200px wide, with a 3:2 aspect ratio. SVG diagrams are explicitly labeled as concepts, not real application screenshots.
- Complete education institution and graduation year if desired.
- Confirm the KodNest training record and fill its dates/description before setting `verified: true`. Unverified records are not rendered as employment claims.
- Confirm certification/achievement titles, issuers, dates, and credential URLs before setting each `verified: true`. No awards or ranks have been invented.

The form validates name, email, and message. With an email configured, it opens a properly encoded draft in the visitor's mail client. The visitor must send that draft. Without an email configured, it clearly states that nothing was sent. Data is not stored. Keep messages short enough for practical mailto support (the form caps the message at 1800 characters). A future email service should replace the handoff in Contact.jsx with a server endpoint; never embed secret API keys in Vite variables.

## Motion, accessibility, and performance

- Desktop uses a procedural torus knot with low-resolution local environment lighting; no fetched HDR files, models, shadows, or postprocessing.
- Tablets use less geometry, no antialiasing, and DPR 1. Desktop DPR is capped at 1.5.
- Mobile and reduced-motion users see static CSS geometry and do not request the Three.js chunk.
- Rendering pauses outside the hero viewport and when the page is hidden. A boundary and context-loss handler provide fallback geometry.
- GSAP is loaded only for desktop/tablet motion, uses scoped cleanup, and responds to motion preference changes. Mobile hero motion uses lightweight CSS. Native scrolling is preserved.
- Semantic sections, visible focus, skip navigation, native modal focus containment/Escape, input labels, error messages, and reduced-motion support are included.
- Fonts are bundled locally; project diagrams are lightweight SVGs and lazy-loaded. Three.js is intentionally isolated from the initial application chunk.

## Browser verification

With `npm run preview` running:

```sh
node scripts/browser-check.mjs
```

The script uses locally installed Chrome (change the channel in the script or install Playwright Chromium if necessary). It checks all requested widths (320, 375, 430, 768, 1024, 1440, 1920), horizontal overflow, images, console/network errors, dialogs, keyboard focus, mobile navigation, form validation, reduced motion, WebGL fallback, and WCAG A/AA automated accessibility rules. Screenshots and results are written to ignored `artifacts/`. Automated accessibility tests do not substitute for human review.

## Deploy to Vercel

1. Push this folder to your Git repository and import it into Vercel.
2. Select the **Vite** framework preset, build command **npm run build**, and output directory **dist**. `vercel.json` also defines these settings.
3. Set optional **VITE_SITE_URL** to the final HTTPS production origin (for example, your assigned Vercel domain, without a trailing slash). It enables canonical, OpenGraph URL, and absolute social-preview image metadata at build time. No environment variables are otherwise required.
4. Deploy. After assigning your final domain, update VITE_SITE_URL and redeploy.
5. Verify profile links, project links, the PDF download, social preview, and mailto handoff on the deployed site.

The rewrite handles SPA paths while excluding asset directories, so missing images/PDFs remain 404s. Hashed assets receive immutable caching; HTML does not. No deployment account has been connected or deployment performed as part of this local implementation.

## Main packages

React, Vite, Tailwind CSS (Vite plugin), Three.js, @react-three/fiber, @react-three/drei, GSAP/ScrollTrigger, Lucide React, and self-hosted Sentient variable fonts (normal and italic, weights 200–700). ESLint, Playwright, and axe are development-only tools.

Implementation references: [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite), [React Three Fiber performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance).


The production build currently emits a size advisory for the optional Three.js chunk (about 256 KB gzip). This chunk is loaded only for the desktop/tablet scene; mobile and reduced-motion clients do not request it. Initial application JavaScript is about 70 KB gzip.


## Featured stack carousel

The stack now follows the hero's "Scroll to explore" link. `src/components/ui/3d-carousel.tsx` adapts the supplied Framer Motion cylinder to portfolio data, with incremental drag rotation, snapping, previous/next controls, arrow keys, Home/End, and a focus-managed native detail dialog. Reduced motion uses a flat card with immediate navigation. The carousel rotates automatically once per minute while visible. Rotation pauses on mouse hover, keyboard focus, dragging, an open detail dialog, or a hidden browser tab. A pause/resume button provides manual control. Reduced-motion mode remains manual.

The full categorized stack remains below the featured cards. Edit `featuredStack` and `stackArtwork` in `src/data/portfolio.js`. Artwork is a single cached 4-by-2 atlas: `public/images/stack/tech-atlas.webp` (about 83 KB); the original generated PNG and exact generation prompt are preserved beside it. `column` and `row` select each technology's cell. `scripts/optimize-stack-art.mjs` reproduces WebP encoding without changing the source artwork.

The project now supports mixed JavaScript/TypeScript via `tsconfig.json`; run `npm run typecheck`. The `@/` alias maps to `src/`. Shared UI components live in `src/components/ui/`, while section components stay in `src/components/` and styles in `src/styles/index.css`. This keeps imported reusable components separate from portfolio sections and lets shadcn resolve its configured paths. `components.json` contains the shadcn directory mapping, and `src/lib/utils.ts` supplies the standard class-merging helper. Tailwind v4 is already configured, so no reinitialization is needed. For future shadcn components, use `npx shadcn@latest add <component>` and review any proposed theme changes.

Additional dependencies: Framer Motion, clsx, tailwind-merge; development-only TypeScript, React typings, and the TypeScript ESLint parser. No context provider or backend is required.

## Page-loading intro

`src/components/ui/3d-box-loader-animation.tsx` contains the supplied eight-box CSS animation, with scoped styles in `src/styles/loader.css` and colors adapted to the dark portfolio. `src/components/PortfolioEntry.tsx` loads the portfolio in the background and shows one three-second cycle on each full page load, then fades out. "Skip intro" bypasses the decorative delay. Reduced-motion users get static geometry with no timed delay. The loader waits for the app itself, not optional images or WebGL assets; a failed app chunk shows a reload action. The hidden page is inert during the intro, scrolling is restored afterward, and existing hash links are preserved. Hero reveal animations begin only as the intro exits. No new packages are needed.

Sound effects: lightweight Web Audio click, navigation, dialog, carousel, and form-feedback cues start after interaction. The header Sound on/off button remembers the visitor's preference locally. These interaction cues are generated locally and have their own Sound effects toggle.

Hero portrait: the metallic scene has been replaced with the user's background-free portrait in public/images/portrait/kasim-cutout.webp. The generated PNG and exact built-in image_gen prompt are saved beside it. CSS perspective follows the pointer on desktop and remains still for touch and reduced-motion users; the Three.js scene is no longer loaded by the page.

Sentient font files are in public/fonts/sentient, with the supplied FFL.txt license preserved. Font faces are configured in src/styles/fonts.css and the normal font is preloaded in index.html.

Contact options: email drafts are addressed to dkasim.ise.rymec@gmail.com, with an email-app option and a Gmail compose fallback. Visitors review and send from their own accounts. The phone link uses tel:+917019588349 and WhatsApp uses https://wa.me/917019588349. No messages or calls are sent automatically. WhatsApp click-to-chat reference: https://faq.whatsapp.com/5913398998672934.

Refresh navigation: browser reloads reset to #home and the top of the hero. Fresh section links still open their requested section, and scroll restoration returns to normal after the loading intro. Regression check: node scripts/check-refresh.mjs (with the preview server running).

Background music: the supplied Acceptance [N°160] - relaxdaily.mp3 is served from public/audio/acceptance-relaxdaily.mp3. Playback loops at 12% gain with 0.3-second fade-in/fade-out and soft loop transitions. It attempts autoplay on load and retries after a visitor gesture if the browser blocks it. The separate Music control pauses the current visit; every fresh page load requests playback again, regardless of old saved preferences. Hidden tabs pause and resume when visible if music is still enabled. Regression check: node scripts/check-music.mjs.
