/* ============================================================================
   main.js — global systems + content injection
   Loads last. Wires reveal, story thread, hearts, audio, keyboard nav, then
   injects text content and boots each chapter module.
   ========================================================================== */
(function () {
  "use strict";

  var CONTENT = window.CONTENT || {};

  /* Respect the user's motion preference everywhere. */
  var REDUCED = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.REDUCED = REDUCED;

  /* ---------------------------------------------------------------------- */
  /* Small helpers                                                          */
  /* ---------------------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  /* ---------------------------------------------------------------------- */
  /* AudioBus — one place that governs all sound + the global mute switch.  */
  /* Starts muted so nothing ever autoplays. Every call is guarded so a     */
  /* missing file or missing Howler never throws.                           */
  /* ---------------------------------------------------------------------- */
  var AudioBus = (function () {
    var muted = true;
    var howls = [];
    var effects = {}; // name -> Howl (loaded lazily, optional files)

    function safe(fn) { try { return fn(); } catch (e) { /* silent */ } }

    function applyMute() {
      safe(function () { if (window.Howler) window.Howler.mute(muted); });
    }

    return {
      get muted() { return muted; },
      register: function (howl) { if (howl) howls.push(howl); return howl; },
      toggle: function () {
        muted = !muted;
        applyMute();
        return muted;
      },
      setMuted: function (v) { muted = !!v; applyMute(); },
      // Play a short effect by name; files are optional and live in assets/audio/.
      play: function (name) {
        if (muted) return;
        safe(function () {
          if (!window.Howl) return;
          if (!effects[name]) {
            effects[name] = new window.Howl({
              src: ["assets/audio/" + name + ".mp3"],
              volume: 0.5,
              onloaderror: function () {},
              onplayerror: function () {},
            });
          }
          effects[name].play();
        });
      },
    };
  })();
  window.AudioBus = AudioBus;

  /* ---------------------------------------------------------------------- */
  /* Scroll reveal                                                          */
  /* ---------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (REDUCED || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Stagger reveal children within a container (used by timeline/playlist). */
  window.staggerReveal = function (nodes, step) {
    step = step || 0.09;
    nodes.forEach(function (el, i) {
      el.style.setProperty("--reveal-delay", (i * step) + "s");
    });
  };

  /* ---------------------------------------------------------------------- */
  /* Story thread — progress meter + chapter nodes                          */
  /* ---------------------------------------------------------------------- */
  var SECTION_IDS = [
    "landing", "chapter-birthday", "chapter-beginning",
    "chapter-music", "chapter-letter", "chapter-final",
  ];

  function initThread() {
    var nodes = document.querySelectorAll("#story-thread .thread-node");
    var fractions = [];

    function layoutNodes() {
      var denom = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      fractions = SECTION_IDS.map(function (id) {
        var s = document.getElementById(id);
        if (!s) return 0;
        return clamp(s.offsetTop / denom, 0, 1);
      });
      nodes.forEach(function (n, i) {
        if (fractions[i] != null) n.style.top = (fractions[i] * 100) + "%";
      });
    }

    function update() {
      var denom = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var progress = clamp(window.scrollY / denom, 0, 1);
      document.documentElement.style.setProperty("--progress", (progress * 100) + "%");
      nodes.forEach(function (n, i) {
        if (progress + 0.02 >= (fractions[i] || 0)) n.classList.add("is-reached");
        else n.classList.remove("is-reached");
      });
    }

    layoutNodes();
    update();
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { update(); ticking = false; });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () { layoutNodes(); update(); });
    // Re-layout once fonts/images settle.
    window.addEventListener("load", function () { layoutNodes(); update(); });
  }

  /* ---------------------------------------------------------------------- */
  /* Floating hearts                                                        */
  /* ---------------------------------------------------------------------- */
  function initHearts() {
    if (REDUCED) return;
    var layer = document.getElementById("hearts-layer");
    if (!layer) return;
    var COUNT = window.innerWidth < 640 ? 9 : 14;
    var svg =
      '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 21s-7.5-4.9-10-9.2C.3 8.6 1.7 5 5 5c2 0 3.3 1.2 4 2.3C9.7 6.2 11 5 13 5c3.3 0 4.7 3.6 3 6.8C19.5 16.1 12 21 12 21z"/></svg>';
    for (var i = 0; i < COUNT; i++) {
      var h = document.createElement("span");
      h.className = "heart";
      h.innerHTML = svg;
      var size = 10 + Math.random() * 22;
      h.style.left = (Math.random() * 100) + "%";
      h.style.width = size + "px";
      h.style.height = size + "px";
      h.style.setProperty("--h-drift", (Math.random() * 80 - 40) + "px");
      h.style.setProperty("--h-scale", (0.7 + Math.random() * 0.6).toFixed(2));
      h.style.setProperty("--h-opacity", (0.25 + Math.random() * 0.4).toFixed(2));
      h.style.animationDuration = (12 + Math.random() * 12) + "s";
      h.style.animationDelay = (-Math.random() * 18) + "s";
      h.style.color = i % 3 === 0 ? "var(--lavender)" : "var(--rose)";
      layer.appendChild(h);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Mute toggle                                                            */
  /* ---------------------------------------------------------------------- */
  function initMute() {
    var btn = document.getElementById("mute-toggle");
    if (!btn) return;
    function sync() {
      var muted = AudioBus.muted;
      btn.setAttribute("aria-pressed", String(muted));
      btn.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
    }
    sync();
    window.syncMuteUI = sync; // let modules refresh the button after changing mute
    btn.addEventListener("click", function () { AudioBus.toggle(); sync(); });
  }

  /* ---------------------------------------------------------------------- */
  /* Keyboard navigation between chapters                                   */
  /* ---------------------------------------------------------------------- */
  function initKeyboardNav() {
    var behavior = REDUCED ? "auto" : "smooth";
    function currentIndex() {
      var mid = window.scrollY + window.innerHeight / 2;
      var best = 0, bestDist = Infinity;
      SECTION_IDS.forEach(function (id, i) {
        var s = document.getElementById(id);
        if (!s) return;
        var c = s.offsetTop + s.offsetHeight / 2;
        var d = Math.abs(c - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }
    function go(delta) {
      var next = clamp(currentIndex() + delta, 0, SECTION_IDS.length - 1);
      var s = document.getElementById(SECTION_IDS[next]);
      if (s) s.scrollIntoView({ behavior: behavior, block: "start" });
    }
    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Content injection (text-driven sections)                               */
  /* ---------------------------------------------------------------------- */
  function injectContent() {
    var C = CONTENT;

    // Landing
    setText("landing-title", C.landingTitle);
    setText("landing-name", C.recipientName);
    setText("landing-message", C.landingMessage);
    setText("begin-journey", C.beginButton);

    // Chapter 1 — Happy Birthday
    if (C.birthday) {
      setText("birthday-eyebrow", C.birthday.eyebrow);
      setText("birthday-title", C.birthday.title);
      setText("birthday-subtitle", C.birthday.subtitle);
      setText("birthday-hint", C.birthday.hint);
      setText("birthday-cta", C.birthday.cta);
    }

    // Chapter 2 — The Beginning (timeline cards)
    if (C.beginning) {
      setText("beginning-eyebrow", C.beginning.eyebrow);
      setText("beginning-title", C.beginning.title);
      setText("beginning-intro", C.beginning.intro);
      buildTimeline(C.beginning.cards || []);
    }

    // Chapter 3 — Music (header only; player module builds the list)
    if (C.music) {
      setText("music-eyebrow", C.music.eyebrow);
      setText("music-title", C.music.title);
      setText("music-intro", C.music.intro);
    }

    // Chapter 4 — Love Letter (header + hint; module types the body)
    if (C.loveLetter) {
      setText("letter-eyebrow", C.loveLetter.eyebrow);
      setText("letter-title", C.loveLetter.title);
      setText("letter-hint", C.loveLetter.sealHint);
    }

    // Chapter 5 — Final Surprise (header + prompt + button)
    if (C.final) {
      setText("final-eyebrow", C.final.eyebrow);
      setText("final-prompt", C.final.prompt);
      setText("final-gift-btn", C.final.button);
    }

    // Update the seal initial + document title with the real name.
    var seal = document.querySelector("#envelope .envelope__seal span");
    if (seal && C.recipientName) seal.textContent = C.recipientName.charAt(0).toUpperCase();
  }

  function buildTimeline(cards) {
    var wrap = document.getElementById("beginning-timeline");
    if (!wrap) return;
    var built = [];
    cards.forEach(function (card, i) {
      var item = document.createElement("article");
      item.className = "tl-card reveal " + (i % 2 === 0 ? "reveal--left" : "reveal--right");
      item.setAttribute("data-reveal", "");

      var media = document.createElement("div");
      media.className = "tl-card__media";
      var img = document.createElement("img");
      img.src = card.imagePath;
      img.alt = card.alt || card.title || "A memory";
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(img);

      var body = document.createElement("div");
      body.className = "tl-card__body glass";
      var date = document.createElement("p");
      date.className = "tl-card__date";
      date.textContent = card.date || "";
      var title = document.createElement("h3");
      title.className = "tl-card__title";
      title.textContent = card.title || "";
      var text = document.createElement("p");
      text.className = "tl-card__text";
      text.textContent = card.text || "";
      body.appendChild(date);
      body.appendChild(title);
      body.appendChild(text);

      var dot = document.createElement("span");
      dot.className = "tl-card__dot";
      dot.setAttribute("aria-hidden", "true");

      item.appendChild(dot);
      item.appendChild(media);
      item.appendChild(body);
      wrap.appendChild(item);
      built.push(item);
    });
    if (window.staggerReveal) window.staggerReveal(built, 0.08);
  }

  /* ---------------------------------------------------------------------- */
  /* Boot                                                                   */
  /* ---------------------------------------------------------------------- */
  function boot() {
    injectContent();
    initReveal();
    initThread();
    initHearts();
    initMute();
    initKeyboardNav();

    // Begin Journey scrolls to chapter one.
    var begin = document.getElementById("begin-journey");
    if (begin) {
      begin.addEventListener("click", function () {
        var s = document.getElementById("chapter-birthday");
        if (s) s.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" });
      });
    }

    // Boot chapter modules (guarded — each is optional).
    if (typeof window.initCelebration === "function") window.initCelebration();
    if (typeof window.initLoveLetter === "function") window.initLoveLetter();
    if (typeof window.initMusicPlayer === "function") window.initMusicPlayer();
    if (typeof window.initFinalSurprise === "function") window.initFinalSurprise();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
