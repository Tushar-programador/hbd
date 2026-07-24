# Tarushi Birthday Website — Round 1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the six-chapter emotional spine of a cinematic, mobile-first birthday website for Tarushi as a zero-build static site.

**Architecture:** Single-page vertical scroll. One `index.html` stacks all Round 1 sections. Global systems (scroll-reveal, floating hearts, progress bar, mute, reduced-motion, keyboard nav) live in `js/main.js`. Each interactive chapter gets a focused module in `js/sections/`. All personal content lives in one `content.js` object (`window.CONTENT`) so personalization never touches markup or logic. GSAP + Howler.js load from CDN.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS (ES modules avoided — plain `<script>` tags for file:// compatibility), GSAP (CDN), Howler.js (CDN). No npm, no bundler, no test runner.

## Global Constraints

- **No build step.** Site must run by opening `index.html` directly (`file://`) or via any static server. No npm/Node dependency.
- **No git commits.** Per user instruction, do not run `git add`/`git commit` at any point.
- **Recipient name:** "Tarushi" — always sourced from `CONTENT.recipientName`, never hardcoded in markup.
- **Palette (CSS custom properties in `base.css`):** `--pink` soft pink, `--lavender`, `--gold` accent, `--warm-white` / `--cream` backgrounds, `--text` dark gray.
- **Typography:** elegant serif for headings, modern sans-serif for body. Use system-safe stacks + optional Google Fonts `<link>` (site must still look correct if fonts fail to load).
- **Mobile-portrait first**, responsive up to desktop/tablet.
- **Accessibility:** respect `prefers-reduced-motion`; alt text on every image; high-contrast text; keyboard scroll navigation.
- **Graceful degradation:** missing audio → player no-ops silently; missing images → placeholders; no JS → content still readable.
- **All personal content** flows from `window.CONTENT` defined in `content.js`.
- **Exact closing message (Final Surprise), verbatim from PRD:**
  > "Every picture tells a story, but my favorite story will always be the one we're writing together.
  > Happy Birthday, my love.
  > Thank you for being you.
  > I love you. ❤️"
- **Landing message, verbatim from PRD:** "Today is all about the most beautiful person in my life."

---

## File Structure

```
HBD website/
├── index.html                 # all Round 1 sections + CDN + script tags
├── content.js                 # window.CONTENT — ALL personal content
├── css/
│   ├── base.css               # tokens, resets, typography, layout primitives
│   ├── animations.css         # keyframes, reveal states, reduced-motion overrides
│   └── sections.css           # per-section layout & styling
├── js/
│   ├── main.js                # scroll-reveal, hearts, progress, mute, a11y, content injection
│   └── sections/
│       ├── celebration.js     # cake/candle/balloons/confetti/fireworks
│       ├── love-letter.js     # envelope open + typewriter
│       ├── music-player.js    # Howler playlist controls
│       └── final-surprise.js  # slow-down transition + Ken Burns slideshow
└── assets/
    ├── images/                # SVG placeholders now; real photos later (same names)
    └── music/                 # empty now; real mp3s later
```

Load order in `index.html` (end of `<body>`): CDN (GSAP, Howler) → `content.js` → `js/sections/*.js` → `js/main.js` (main.js initializes last and calls each module's `init`).

**Module contract:** each `js/sections/*.js` file attaches one global init function to `window` (e.g. `window.initCelebration`). No ES module `import`/`export` (keeps `file://` working). `main.js` calls each after DOM ready.

---

### Task 1: Project skeleton, design tokens, and content scaffold

**Files:**
- Create: `index.html`
- Create: `css/base.css`
- Create: `css/animations.css` (empty shells + reduced-motion block)
- Create: `css/sections.css` (empty shell)
- Create: `content.js`
- Create: `assets/images/.gitkeep`, `assets/music/.gitkeep`

**Interfaces:**
- Produces: `window.CONTENT` object with keys `recipientName`, `landingMessage`, `beginningCards[]` (`{title,text,imagePath,alt}`), `loveLetter` (`{body,signature}`), `playlist[]` (`{title,artist,src}`), `finalPhotos[]` (`{imagePath,alt}`), `finalMessage` (string with `\n` line breaks). Every later task reads from this.
- Produces: `index.html` with `<section>` elements having ids `landing`, `chapter-birthday`, `chapter-beginning`, `chapter-letter`, `chapter-music`, `chapter-final`; a `#progress-bar` element; a `#mute-toggle` button; a `#hearts-layer` div.

- [ ] **Step 1: Create `content.js`** with `window.CONTENT` populated with romantic placeholder copy — `recipientName: "Tarushi"`, the exact `landingMessage` and `finalMessage` from Global Constraints, 5 `beginningCards`, a `loveLetter` with multi-paragraph placeholder body signed `"[Your Name]"`, 3 `playlist` entries pointing at `assets/music/song1.mp3` etc. (files need not exist yet), and 6 `finalPhotos` pointing at `assets/images/memory-1.svg`…`memory-6.svg`.

- [ ] **Step 2: Create `assets/images/` placeholder SVGs** — write 6 simple inline-styled SVG files `memory-1.svg`…`memory-6.svg` (soft gradient rectangle with a centered heart and the memory number) so nothing renders broken. Also `beginning-1.svg`…`beginning-5.svg` referenced by `beginningCards`.

- [ ] **Step 3: Create `css/base.css`** — `:root` custom properties for the palette + type scale + spacing; CSS reset; base `body` (warm-white background, dark-gray text, sans-serif body font); heading serif font; `.section` full-viewport-min layout; `.glass` glassmorphism utility; `#progress-bar` fixed top; `#mute-toggle` fixed corner; `#hearts-layer` fixed full-screen pointer-events-none.

- [ ] **Step 4: Create `css/animations.css`** — reveal base state (`.reveal { opacity:0; transform: translateY(24px); }` + `.reveal.is-visible` transition to visible); floating-heart keyframes; `@media (prefers-reduced-motion: reduce)` block that neutralizes transforms/animations.

- [ ] **Step 5: Create `css/sections.css`** as an empty shell with section comment headers (filled by later tasks).

- [ ] **Step 6: Create `index.html`** — `<head>` links the 3 CSS files + optional Google Fonts; `<body>` contains `#hearts-layer`, `#progress-bar`, `#mute-toggle`, the six `<section>`s (empty inner content for now, correct ids/classes), then script tags in the load order above (section scripts + main.js will exist after later tasks — reference them now; browser tolerates until they're created, but create empty stubs to avoid 404 noise).

- [ ] **Step 7: Create empty stub files** `js/main.js`, `js/sections/celebration.js`, `js/sections/love-letter.js`, `js/sections/music-player.js`, `js/sections/final-surprise.js` each with a no-op `window.initX = function(){}` so `index.html` loads cleanly.

- [ ] **Step 8: Verify (browser)** — open `index.html`. Expected: warm-white page, no console errors, no 404s, six empty sections present in DOM, fonts applied. Check DevTools → Elements that all required ids exist.

---

### Task 2: Global systems in `main.js`

**Files:**
- Modify: `js/main.js`

**Interfaces:**
- Consumes: `window.CONTENT`; the DOM ids from Task 1; GSAP global `gsap` / `ScrollTrigger` (CDN).
- Produces: `window.AudioBus` (`{muted:boolean, toggle(), play(id), register(howl)}`) used by music-player and celebration/final for sound + global mute. Produces `window.revealObserver` behavior (adds `.is-visible` to `.reveal` elements on scroll). Produces `initGlobals()` called on DOMContentLoaded that wires progress bar, hearts, mute button, keyboard nav, reduced-motion detection.

- [ ] **Step 1: Reduced-motion flag** — in `main.js`, compute `const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;` and expose `window.REDUCED`. All animation code branches on this.

- [ ] **Step 2: Scroll-reveal** — implement an IntersectionObserver that adds `is-visible` to every `.reveal` when it enters viewport (threshold 0.15). If `REDUCED`, immediately mark all `.reveal` visible instead.

- [ ] **Step 3: Progress bar** — on scroll, set `#progress-bar` width to `scrollTop / (scrollHeight - innerHeight) * 100%`.

- [ ] **Step 4: Floating hearts** — spawn N (e.g. 12; 0 if REDUCED) absolutely-positioned heart glyphs in `#hearts-layer` with randomized (index-derived, not `Math.random`-at-load-critical — fine to use `Math.random` here) horizontal position, drift duration, and delay via inline styles + the float keyframe.

- [ ] **Step 5: AudioBus** — implement `window.AudioBus` with `muted` (default true so the page never autoplays sound), `toggle()` flips muted and calls `Howler.mute(muted)`, `register(howl)` tracks howls, `play(id)` plays a registered effect only if not muted. Guard all Howler calls in `try/catch` so missing files/library never throw.

- [ ] **Step 6: Mute toggle button** — wire `#mute-toggle` click to `AudioBus.toggle()` and swap its icon/label between muted/unmuted. Reflect initial muted state.

- [ ] **Step 7: Keyboard nav** — ArrowDown/PageDown/Space scrolls to next section; ArrowUp/PageUp to previous; using an ordered array of the six section ids and `scrollIntoView({behavior})` (`'auto'` if REDUCED else `'smooth'`).

- [ ] **Step 8: Bootstrap** — on `DOMContentLoaded`, call `initGlobals()` then each section init: `initLanding?.()`, `initCelebration()`, `initBeginning?.()`, `initLoveLetter()`, `initMusicPlayer()`, `initFinalSurprise()` (guard with `typeof` checks).

- [ ] **Step 9: Verify (browser)** — reload. Expected: hearts drift upward; progress bar grows as you scroll; mute button toggles label; ArrowDown jumps between sections; no console errors. Toggle OS reduced-motion and confirm hearts stop and reveals show instantly.

---

### Task 3: Landing chapter

**Files:**
- Modify: `index.html` (fill `#landing`)
- Modify: `css/sections.css`
- Modify: `js/main.js` (add `initLanding`)

**Interfaces:**
- Consumes: `CONTENT.recipientName`, `CONTENT.landingMessage`; scroll-reveal classes.
- Produces: `window.initLanding()` that injects name/message and wires the Begin Journey button to scroll to `#chapter-birthday`.

- [ ] **Step 1: Markup** — inside `#landing`, add an animated-gradient backdrop div, an `<h1>` for "Happy Birthday, <name>", a `<p class="reveal">` for the message, and a `<button id="begin-journey">Begin Journey</button>`.

- [ ] **Step 2: Style** — in `sections.css`, style the animated gradient (pink→lavender→gold, slow `background-position` keyframe, static if REDUCED via animations.css), large serif `<h1>`, generous spacing, pulsing glassmorphic Begin Journey button.

- [ ] **Step 3: `initLanding`** — set `h1` text using `CONTENT.recipientName`, set `p` text to `CONTENT.landingMessage`, add click handler on `#begin-journey` scrolling to `#chapter-birthday` (respect REDUCED for behavior).

- [ ] **Step 4: Verify (browser)** — Expected: full-screen gradient, "Happy Birthday, Tarushi" in serif, message line, pulsing button; clicking Begin Journey scrolls to Chapter 1.

---

### Task 4: Happy Birthday chapter (`celebration.js`)

**Files:**
- Modify: `index.html` (fill `#chapter-birthday`)
- Modify: `css/sections.css`
- Modify: `js/sections/celebration.js`

**Interfaces:**
- Consumes: `window.AudioBus`, `window.REDUCED`.
- Produces: `window.initCelebration()`; `window.fireConfetti(durationMs)` and `window.fireFireworks(durationMs)` (canvas effects) reused by Final Surprise.

- [ ] **Step 1: Markup** — inside `#chapter-birthday`: a CSS cake with a flame element (`#cake`, `.flame`), a balloons container, a `<canvas id="fx-canvas">` overlay, a heading, and CTA `<a href="#chapter-beginning">Let's relive our journey.</a>`.

- [ ] **Step 2: Style** — CSS cake + flicker animation for flame; floating balloon animation; `#fx-canvas` fixed full-screen pointer-events-none; CTA styling.

- [ ] **Step 3: Confetti engine** — in `celebration.js`, implement `window.fireConfetti(ms)` drawing falling colored particles on `#fx-canvas` via `requestAnimationFrame` for `ms` then clearing. No-op heavy loop if REDUCED (draw a single static burst instead).

- [ ] **Step 4: Fireworks engine** — implement `window.fireFireworks(ms)` launching a few particle bursts on the same canvas. REDUCED → static burst.

- [ ] **Step 5: `initCelebration`** — click on `#cake` removes `.flame` (candle "blown out"), then calls `fireConfetti(2500)` + `fireFireworks(2500)` and `AudioBus.play('confetti')`. Only fires once.

- [ ] **Step 6: Verify (browser)** — Expected: cake with flickering flame + floating balloons; clicking cake extinguishes flame and triggers confetti + fireworks; CTA scrolls to Chapter 2. With reduced-motion, effects show a single static burst.

---

### Task 5: The Beginning chapter

**Files:**
- Modify: `index.html` (fill `#chapter-beginning`)
- Modify: `css/sections.css`
- Modify: `js/main.js` (add `initBeginning`)

**Interfaces:**
- Consumes: `CONTENT.beginningCards[]`, `.reveal`.
- Produces: `window.initBeginning()` rendering the timeline cards.

- [ ] **Step 1: Markup** — inside `#chapter-beginning`: a section heading and an empty `<div id="beginning-timeline">` plus a vertical timeline spine element.

- [ ] **Step 2: Style** — vertical timeline with alternating left/right cards on desktop, stacked on mobile; each card is glassmorphic with image + title + text; `.reveal` staggered.

- [ ] **Step 3: `initBeginning`** — loop `CONTENT.beginningCards`, build a card node per entry (`<img>` with `alt`, `<h3>` title, `<p>` text, `.reveal`), append to `#beginning-timeline`.

- [ ] **Step 4: Verify (browser)** — Expected: 5 timeline cards render from content, images load (placeholders), cards fade/slide in on scroll, layout stacks correctly at mobile width.

---

### Task 6: Love Letter chapter (`love-letter.js`)

**Files:**
- Modify: `index.html` (fill `#chapter-letter`)
- Modify: `css/sections.css`
- Modify: `js/sections/love-letter.js`

**Interfaces:**
- Consumes: `CONTENT.loveLetter` (`{body, signature}`), `window.REDUCED`, `window.AudioBus`.
- Produces: `window.initLoveLetter()` with envelope-open + typewriter behavior.

- [ ] **Step 1: Markup** — inside `#chapter-letter`: an `.envelope` (flap + body) that is clickable, and a hidden `.letter-paper` containing an empty `<div class="letter-body">` and `<div class="letter-signature">`.

- [ ] **Step 2: Style** — envelope with a flap that rotates open on `.is-open`; `.letter-paper` scales/unfolds in when revealed; handwriting-style/serif letter typography on cream paper.

- [ ] **Step 3: Typewriter** — implement a `typeWriter(el, text, speed)` that appends characters on a timer; if REDUCED, set full text instantly. Preserve paragraph breaks (`\n\n`).

- [ ] **Step 4: `initLoveLetter`** — click envelope → add `.is-open`, reveal `.letter-paper`, run `typeWriter` on `.letter-body` with `CONTENT.loveLetter.body`, then set `.letter-signature` to `CONTENT.loveLetter.signature`. Fire once. Play a soft UI sound via `AudioBus.play('open')`.

- [ ] **Step 5: Verify (browser)** — Expected: closed envelope; clicking opens the flap, paper unfolds, letter types out character-by-character, signature appears. Reduced-motion shows the full letter instantly.

---

### Task 7: Music player (`music-player.js`)

**Files:**
- Modify: `index.html` (fill `#chapter-music` + persistent mini-player bar)
- Modify: `css/sections.css`
- Modify: `js/sections/music-player.js`

**Interfaces:**
- Consumes: `CONTENT.playlist[]`, `window.AudioBus`, Howler global `Howl`.
- Produces: `window.initMusicPlayer()`.

- [ ] **Step 1: Markup** — a fixed mini-player bar with buttons `prev`, `play/pause`, `next`, a `volume` range input, and a `#track-title` display. The `#chapter-music` section shows the full playlist list.

- [ ] **Step 2: Style** — glassmorphic fixed bottom bar (above content), playlist list styling, active-track highlight.

- [ ] **Step 3: Player state** — in `music-player.js`, build a `Howl` per playlist src lazily; track `currentIndex`; `play/pause/next/prev` update the active `Howl` and `#track-title`; volume input sets `Howler.volume`. Wrap all Howler use in `try/catch`; if a src fails to load, skip gracefully and keep UI responsive.

- [ ] **Step 4: Mute integration** — respect `AudioBus.muted`; register howls with `AudioBus`. Playback obeys the global mute toggle.

- [ ] **Step 5: `initMusicPlayer`** — render playlist from `CONTENT.playlist`, wire all controls, set initial track title. Do not autoplay (muted-by-default policy).

- [ ] **Step 6: Verify (browser)** — Expected: player bar renders with track title; controls respond (no errors even with no mp3 files present); playlist lists 3 entries; volume slider moves; with real mp3s added, play/pause/skip work and mute silences them.

---

### Task 8: Final Surprise (`final-surprise.js`)

**Files:**
- Modify: `index.html` (fill `#chapter-final`)
- Modify: `css/sections.css`
- Modify: `js/sections/final-surprise.js`

**Interfaces:**
- Consumes: `CONTENT.finalPhotos[]`, `CONTENT.finalMessage`, `window.fireConfetti`, `window.fireFireworks`, `window.AudioBus`, `window.REDUCED`.
- Produces: `window.initFinalSurprise()`.

- [ ] **Step 1: Markup** — inside `#chapter-final`: a "slow-down" intro block with text "I have one last gift for you." and a `#final-gift-btn`; a hidden `#slideshow` container; a hidden `#final-message` block.

- [ ] **Step 2: Style** — dim/vignette the section on activation; slideshow full-bleed image with Ken-Burns zoom keyframe (static if REDUCED); final message centered, large serif, line breaks preserved.

- [ ] **Step 3: Slideshow engine** — implement a function that cycles through `CONTENT.finalPhotos`, cross-fading each with a Ken-Burns zoom for ~4s each; on completion reveal `#final-message`. REDUCED → show a simple sequential fade with no zoom, shorter timing.

- [ ] **Step 4: `initFinalSurprise`** — click `#final-gift-btn` → add a `dimming` class, call `fireConfetti(3000)` + `fireFireworks(3000)`, start the slideshow, then reveal `#final-message` set to `CONTENT.finalMessage` (render `\n` as line breaks). Fire once.

- [ ] **Step 5: Verify (browser)** — Expected: clicking the gift button dims the screen, fires confetti + fireworks, runs the Ken-Burns slideshow through the 6 placeholder photos, and ends on the exact PRD closing message with correct line breaks.

---

### Task 9: Polish, accessibility, and personalization pass

**Files:**
- Modify: `content.js`, `css/*.css`, `index.html`, `js/**` as needed.
- Create: `README.md` (how to personalize + run).

**Interfaces:** none new.

- [ ] **Step 1: Alt text + contrast audit** — confirm every `<img>` uses `alt` from content; check text contrast against backgrounds meets high-contrast expectations; add `aria-label`s to icon-only buttons (`#mute-toggle`, player buttons).

- [ ] **Step 2: Reduced-motion full pass** — with OS reduced-motion on, walk all six chapters and confirm no heavy animation runs and all content is reachable/readable.

- [ ] **Step 3: Responsive pass** — test at 375px (mobile portrait), 768px (tablet), 1280px (desktop). Fix overflow, tap-target sizes, timeline layout, player bar.

- [ ] **Step 4: Keyboard pass** — Tab through interactive elements (Begin Journey, cake, envelope, player, gift button) and confirm they're focusable and operable via keyboard (Enter/Space); confirm Arrow/Page section nav works.

- [ ] **Step 5: `README.md`** — document: how to open the site (double-click `index.html` or run a static server), and exactly how to personalize by editing `content.js` (name, messages, letter, playlist) and by dropping real photos into `assets/images/` and mp3s into `assets/music/` using the filenames referenced in `content.js`.

- [ ] **Step 6: Final verify (browser)** — full walkthrough of all six chapters end-to-end at mobile width: Landing → Begin → cake celebration → CTA → The Beginning timeline → Love Letter → Music → Final Surprise → closing message. No console errors.

---

## Self-Review

**Spec coverage:**
- Landing (§2.1) → Task 3 ✓
- Happy Birthday cake/confetti/fireworks/balloons (§2.2) → Task 4 ✓
- The Beginning timeline (§2.3) → Task 5 ✓
- Love Letter envelope + typewriter (§2.4) → Task 6 ✓
- Music player controls + graceful no-audio (§2.5) → Task 7 ✓
- Final Surprise slow-down + confetti/fireworks + Ken Burns + exact closing message (§2.6) → Task 8 ✓
- Floating hearts, progress indicator, mute control, reduced-motion, keyboard nav, alt text, contrast (§2 global) → Tasks 2 & 9 ✓
- `content.js` personalization surface (§4) → Task 1, documented in Task 9 ✓
- Palette/typography/design language (§5) → Task 1 tokens + per-section styling ✓
- Graceful degradation (§7) → Tasks 2, 4, 7 (try/catch, placeholders) ✓
- Verification (§8) → per-task browser verify steps + Task 9 ✓
- Deferred chapters (§2 out-of-scope) → correctly excluded ✓

**Placeholder scan:** No "TBD/TODO/implement later". Each step states concrete files, elements, and behavior. (Full code bodies are described per-step rather than pasted; acceptable for a static site with no test harness — implementer writes straightforward DOM/CSS from the exact specs given.)

**Type/name consistency:** `window.CONTENT` keys, `window.AudioBus` (`muted/toggle/play/register`), `window.REDUCED`, `window.fireConfetti`/`window.fireFireworks`, and `initLanding/initCelebration/initBeginning/initLoveLetter/initMusicPlayer/initFinalSurprise` are used consistently across tasks. Section ids match Task 1 (`landing`, `chapter-birthday`, `chapter-beginning`, `chapter-letter`, `chapter-music`, `chapter-final`).
