# Tarushi Birthday Website — Design Spec (MVP Round 1)

**Date:** 2026-07-10
**Source:** `prd.md` ("For Her ❤️ — A Birthday Experience Built With Love")
**Recipient:** Tarushi

---

## 1. Purpose & Vision

A digital love letter — a scrolling, cinematic birthday experience for Tarushi. Not a
tech demo; an emotional gift. Each section reveals slowly with smooth animation so the
pacing feels heartfelt rather than rushed. Mobile-portrait first, elegant on desktop/tablet.

This spec covers **Round 1: the MVP emotional spine**. The remaining PRD chapters are
listed as deferred and will each get their own round using the same architecture.

---

## 2. Scope

### In scope (Round 1)

Six chapters forming one complete, polished end-to-end flow:

1. **Landing** — animated gradient background, floating hearts, soft music toggle,
   "Happy Birthday, Tarushi" title (elegant serif), the PRD message line
   ("Today is all about the most beautiful person in my life."), pulsing **Begin Journey** button.
2. **Happy Birthday** — animated cake (click to blow out candle → triggers confetti + fireworks),
   floating balloons, CTA "Let's relive our journey."
3. **The Beginning** — 4–5 placeholder memory cards (first meeting, first conversation,
   first picture, first memory) revealed as a timeline on scroll.
4. **Love Letter** — closed envelope → click opens → paper unfolds → typewriter effect reveals
   the letter (placeholder text, signed "[Your Name]").
5. **Music** — persistent mini player: play / pause / skip / prev / volume + track title,
   wired to a playlist array. No-ops gracefully when no mp3s are present yet.
6. **Final Surprise** — slow-down transition, "I have one last gift for you," click →
   confetti + fireworks → Ken-Burns slideshow through the placeholder photos → ends on the
   PRD's exact closing message.

### Global features (Round 1)

- Floating-hearts ambient layer
- Thin progress indicator showing position across chapters
- Fixed mute/unmute control for all audio
- `prefers-reduced-motion` support (disables heavy motion, keeps content accessible)
- Keyboard scroll navigation
- Alt text on every placeholder image
- High-contrast, readable text

### Out of scope (deferred to later rounds — same architecture)

PRD Chapters 3, 4, 5, 6, 7, 8, 9, 12, 13, 14:
- Interactive relationship timeline (The Story of Us)
- 50 Beautiful Memories gallery
- 50 Reasons I Love You
- Your Smile portrait section
- Adventures Together (animated map)
- Little Things candid moments
- Open When… envelopes
- Mini Games (quiz, puzzle, scratch card, hidden hearts)
- Dreams cards
- Secret Surprise (password-locked)

---

## 3. Technical Approach

**Simple static site** — no framework, no build step, no Node dependency. Open `index.html`
directly in a browser or serve the folder with any static server.

- **Structure:** single-page vertical scroll; all Round 1 sections stacked in one `index.html`.
- **Animation:** GSAP via CDN `<script>` (scroll-triggered reveals, Ken Burns, transitions).
- **Audio:** Howler.js via CDN `<script>` (background music + UI/confetti/fireworks sounds,
  all mute-controlled).
- **Confetti/fireworks:** lightweight canvas effects (self-contained JS; CDN library if cleaner).
- **No bundler/npm.** CDN scripts keep animation/audio quality high while preserving zero-build simplicity.

> Note: this diverges from the PRD's Next.js/TypeScript/Tailwind stack by explicit user choice
> in favor of a simpler static site. The design language, palette, typography, and content goals
> are preserved.

---

## 4. File Structure

```
HBD website/
├── index.html                 # page structure, all Round 1 sections
├── content.js                 # ALL personal content (edit this to personalize)
├── css/
│   ├── base.css               # design tokens: colors, type scale, spacing, resets
│   ├── animations.css         # keyframes, reveal states, reduced-motion overrides
│   └── sections.css           # per-section layout & styling
├── js/
│   ├── main.js                # scroll-reveal engine, nav, hearts, progress, mute, a11y
│   └── sections/
│       ├── celebration.js     # cake / candle / confetti / fireworks / balloons
│       ├── love-letter.js     # envelope open + paper unfold + typewriter
│       ├── music-player.js    # Howler playlist controls
│       └── final-surprise.js  # slow-down transition + Ken Burns slideshow
└── assets/
    ├── images/                # placeholder graphics now; real photos later (same filenames)
    └── music/                 # placeholder/empty now; real mp3s later
```

### `content.js` — the personalization surface

A single plain-JS object holding everything personal so the user edits one file, never markup/logic:

- `recipientName` ("Tarushi")
- `landingMessage`
- `beginningCards[]` — { title, text, imagePath, alt }
- `loveLetter` — { body text, signature }
- `playlist[]` — { title, artist, src }
- `finalPhotos[]` — { imagePath, alt } for the slideshow
- `finalMessage` — the PRD's closing text

Placeholder images and romantic sample copy ship now; the user swaps real photos/mp3s in
later using the same filenames `content.js` references.

---

## 5. Design Language

- **Style:** romantic, minimal, premium, elegant, warm, cinematic (Apple-page / luxury-photo-book feel; glassmorphism).
- **Palette:** primary Soft Pink; secondary Lavender; accent Gold; background Warm White / Light Cream; text Dark Gray. Defined as CSS custom properties in `base.css`.
- **Typography:** elegant serif headings, modern sans-serif body, generous spacing, high readability.
- **Motion:** everything reveals gently; fades, slides, floating hearts, glass blur, typewriter, confetti, fireworks, Ken Burns. Target 60 FPS.

---

## 6. Data Flow

1. `content.js` loads first, exposing a global `CONTENT` object.
2. `main.js` initializes global systems (scroll observer, hearts, progress, mute state) and
   populates content-driven sections from `CONTENT`.
3. Each `js/sections/*.js` module attaches behavior to its section, reading from `CONTENT`
   and respecting the global mute + reduced-motion state.
4. Audio flows through a single Howler-backed controller so the mute toggle governs all sound.

---

## 7. Error Handling & Graceful Degradation

- **Missing audio:** music player and sound effects no-op silently if files are absent
  (player UI still renders; controls simply do nothing audible).
- **Missing images:** placeholder graphics ensure no broken layouts before real photos arrive.
- **Reduced motion:** heavy animations are disabled/simplified; all content remains reachable.
- **No JS / load failure:** content sections remain readable as plain scrolled HTML.

---

## 8. Testing / Verification

Manual verification in-browser (mobile-portrait viewport primary):

- Each chapter reveals on scroll and reads correctly.
- Begin Journey scrolls/advances to Chapter 1.
- Cake click triggers confetti + fireworks.
- Envelope opens and typewriter completes the letter.
- Music controls respond (with placeholder audio present); mute silences everything.
- Final Surprise runs the slideshow and ends on the closing message.
- `prefers-reduced-motion` disables heavy motion.
- Keyboard navigation moves through the page.

---

## 9. Success Criteria

Round 1 succeeds if the six-chapter spine feels personal, elegant, and emotionally paced —
a complete, delightful flow Tarushi can walk through end to end, ready for real photos and
stories to be dropped in, and ready to extend with the deferred chapters.
