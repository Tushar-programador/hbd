# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A cinematic, scrolling single-page birthday website ("For Tarushi ❤️") — a personal gift, not a
generic template. This is **Round 1**: the emotional-spine MVP covering 6 of the ~15 chapters
described in `prd.md`. See `docs/superpowers/specs/2026-07-10-tarushi-birthday-website-design.md`
for the full design spec and `docs/superpowers/plans/2026-07-10-tarushi-birthday-website.md` for
the implementation plan this round followed.

**Important divergence from `prd.md`:** the PRD specifies a Next.js/TypeScript/Tailwind/Framer
Motion stack, but this was deliberately built as a **plain static site — vanilla HTML/CSS/JS, no
framework, no build step, no npm** — by explicit user choice. Keep this constraint when extending
the project unless told otherwise; don't introduce a bundler or framework.

## Running it

No install, no build. Either:
- Double-click `index.html`, or
- Serve the folder so fonts/assets load cleanly: `python -m http.server 8000` then visit
  `http://localhost:8000`

There is no test suite, linter, or package.json — nothing to run except a local static server.
Verify changes by opening the page in a browser and checking the relevant chapter/interaction
(scroll, tap cake, open envelope, keyboard nav Arrow/Page keys, etc.), including with
`prefers-reduced-motion` on and at a mobile-portrait viewport (the primary target).

## Content vs. code — critical separation

**All personalized content lives in `content.js`** (`window.CONTENT` object): names, chapter
copy, timeline card text, playlist, love letter body, closing message, easter-egg strings.
Placeholders are written as `[like this]`. When asked to "personalize" or "fill in" content,
edit **only** `content.js` — never hardcode personal text into HTML/CSS/JS. `js/main.js`'s
`injectContent()` is what reads `window.CONTENT` and writes it into the DOM at boot.

Photos referenced from `content.js` live in `assets/images/` (currently SVG placeholders);
music in `assets/music/` (currently empty — player degrades gracefully with no sound);
optional sound effects (`confetti.mp3`, `open.mp3`, `pop.mp3`) go in `assets/audio/` and are
loaded lazily/optionally by `AudioBus.play(name)`.

## Architecture

Single-page vertical scroll. All chapters are `<section class="section">` elements stacked in
`index.html`; `js/main.js` boots last and wires everything together.

**Load order matters** (see bottom of `index.html`): GSAP + Howler (CDN) → `content.js` →
each `js/sections/*.js` chapter module → `js/sparkle.js` → `js/easter-eggs.js` → `js/main.js`.
Every chapter module attaches an `init*` function to `window` (e.g. `window.initCelebration`,
`window.initLoveLetter`, `window.initMusicPlayer`, `window.initFinalSurprise`); `main.js`'s
`boot()` calls each one only if it exists, so chapter modules are independent/optional and
never assume load order relative to each other — only relative to `main.js` running last.

**Global systems, all defined in `js/main.js`:**
- `AudioBus` (`window.AudioBus`) — single gate for all sound. Starts muted; nothing autoplays.
  `AudioBus.play(name)` lazily loads `assets/audio/<name>.mp3` via Howler and no-ops silently on
  missing files/Howler. All effect playback across modules must go through this, not raw Howler.
- Scroll-reveal engine — elements with `[data-reveal]` fade/slide in via IntersectionObserver
  (`window.revealObserve`); disabled (shown immediately) when `prefers-reduced-motion` is set.
  `window.staggerReveal(nodes, step)` staggers reveal delays for generated lists (timeline cards,
  playlist items).
- Story thread (`#story-thread`) — scroll-progress meter + clickable chapter nodes, driven by
  the `SECTION_IDS` array, which is the canonical ordered list of chapter section IDs.
- `window.REDUCED` — global reduced-motion flag; check this before any nontrivial animation in
  new code, mirroring the existing pattern in every module.
- Keyboard nav — Arrow/Page keys step through `SECTION_IDS`.

**Chapter modules** (`js/sections/*.js`), each IIFE-wrapped and independent:
- `celebration.js` — cake/candle/balloons (Chapter 1) **and** the shared canvas particle engine
  used everywhere else: `window.fireConfetti(ms)`, `window.fireFireworks(ms)`, `window.firePop(x,y)`.
  Reuse these rather than building new effects.
- `love-letter.js` — envelope open → paper unfold → typewriter reveal of `content.js`'s letter body.
- `music-player.js` — Howler-backed playlist logic + the persistent mini-player UI (bottom of page).
- `final-surprise.js` — closing chapter: gift reveal → confetti/fireworks → Ken Burns slideshow
  through `CONTENT.final.photos` → closing message.
- `sparkle.js` — desktop cursor sparkle delight layer.
- `easter-eggs.js` — hidden hearts, Konami code, typing her name, wax-seal whisper, etc.
  (strings for these live in `CONTENT.easterEggs`).

**CSS** (plain stylesheets, no preprocessor):
- `css/base.css` — design tokens (colors, type scale, spacing) and resets.
- `css/animations.css` — keyframes, `[data-reveal]`/`.is-visible` states, reduced-motion overrides.
- `css/sections.css` — per-chapter layout and styling.

**Design language** (from `prd.md`): romantic/minimal/premium/elegant/cinematic. Palette: soft
pink + lavender primary/secondary, gold accent, warm white/cream background, dark gray text.
Elegant serif for headings, modern sans for body. Mobile-portrait is the primary target;
desktop/tablet secondary.

## Extending to later PRD chapters

`prd.md` describes further chapters not yet built (Story of Us timeline, 50 Memories, 50 Reasons,
Your Smile, Adventures, Little Things, Open-When envelopes, mini-games, Dreams, password-locked
Secret Surprise). When implementing these, follow the same architecture: add a new
`<section class="section">` to `index.html`, a corresponding entry in `main.js`'s `SECTION_IDS`,
a new `js/sections/*.js` module exposing an `init*` function, content driven from `content.js`,
and styles added to `css/sections.css` — keep it a static/no-build site.
