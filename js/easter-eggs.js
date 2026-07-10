/* ============================================================================
   easter-eggs.js — hidden delights:
     • Hidden-hearts hunt (find them all → a secret note)
     • Type her name anywhere → a secret whisper + heart rain
     • The Konami code → extra fireworks + a secret
     • Shared toast + secret-modal helpers (window.showEggToast / showSecret)
   Exposes: window.initEasterEggs(), window.showEggToast(), window.showSecret()
   ========================================================================== */
(function () {
  "use strict";

  var eggs = {};

  /* ------------------------------------------------------------------ */
  /* Toast                                                              */
  /* ------------------------------------------------------------------ */
  var toastEl = null, toastTimer = null;
  window.showEggToast = function (msg) {
    if (!msg) return;
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "egg-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<span class="egg-toast__heart">♥</span><span></span>';
    toastEl.querySelector("span:last-child").textContent = msg;
    toastEl.classList.add("show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  };

  /* ------------------------------------------------------------------ */
  /* Secret modal                                                      */
  /* ------------------------------------------------------------------ */
  var overlay = null, lastFocus = null;
  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.id = "secret-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="secret-card glass" role="dialog" aria-modal="true" aria-labelledby="secret-title">' +
        '<div class="secret-card__spark" aria-hidden="true">✦</div>' +
        '<h3 id="secret-title" class="secret-card__title"></h3>' +
        '<p class="secret-card__msg"></p>' +
        '<button class="btn secret-card__close"></button>' +
      "</div>";
    document.body.appendChild(overlay);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeSecret(); });
    overlay.querySelector(".secret-card__close").addEventListener("click", closeSecret);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("show")) closeSecret();
    });
  }
  window.showSecret = function (title, msg) {
    if (!overlay) buildOverlay();
    lastFocus = document.activeElement;
    overlay.querySelector(".secret-card__title").textContent = title || "";
    overlay.querySelector(".secret-card__msg").textContent = msg || "";
    var closeBtn = overlay.querySelector(".secret-card__close");
    closeBtn.textContent = eggs.closeLabel || "Close";
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    if (window.fireConfetti) window.fireConfetti(2400);
    window.setTimeout(function () { closeBtn.focus(); }, 60);
  };
  function closeSecret() {
    if (!overlay) return;
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ------------------------------------------------------------------ */
  /* Heart rain                                                         */
  /* ------------------------------------------------------------------ */
  function heartRain(count) {
    if (window.REDUCED) return;
    var layer = document.getElementById("hearts-layer");
    if (!layer) return;
    var svg =
      '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 21s-7.5-4.9-10-9.2C.3 8.6 1.7 5 5 5c2 0 3.3 1.2 4 2.3C9.7 6.2 11 5 13 5c3.3 0 4.7 3.6 3 6.8C19.5 16.1 12 21 12 21z"/></svg>';
    for (var i = 0; i < (count || 26); i++) {
      var h = document.createElement("span");
      h.className = "heart heart--rain";
      h.innerHTML = svg;
      var size = 12 + Math.random() * 26;
      h.style.left = (Math.random() * 100) + "%";
      h.style.width = size + "px";
      h.style.height = size + "px";
      h.style.setProperty("--h-drift", (Math.random() * 90 - 45) + "px");
      h.style.setProperty("--h-scale", (0.7 + Math.random() * 0.7).toFixed(2));
      h.style.setProperty("--h-opacity", (0.5 + Math.random() * 0.5).toFixed(2));
      h.style.animationDuration = (5 + Math.random() * 4) + "s";
      h.style.animationDelay = (-Math.random() * 2) + "s";
      h.style.color = i % 3 === 0 ? "var(--lavender)" : (i % 3 === 1 ? "var(--gold)" : "var(--rose)");
      layer.appendChild(h);
      (function (node) {
        window.setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 9000);
      })(h);
    }
  }
  window.eggHeartRain = heartRain;

  /* ------------------------------------------------------------------ */
  /* Hidden-hearts hunt                                                 */
  /* ------------------------------------------------------------------ */
  // Subtle spots across the chapters. Small, semi-transparent, findable.
  var SPOTS = [
    { id: "landing",           css: { left: "7%",  top: "16%" } },
    { id: "chapter-birthday",  css: { right: "7%", top: "24%" } },
    { id: "chapter-beginning", css: { left: "51%", bottom: "7%" } },
    { id: "chapter-music",     css: { right: "8%", top: "12%" } },
    { id: "chapter-letter",    css: { left: "9%",  bottom: "15%" } },
  ];

  function initHearts() {
    var target = eggs.hiddenHeartCount || SPOTS.length;
    var spots = SPOTS.slice(0, target);
    var found = 0;

    var chip = document.createElement("div");
    chip.id = "egg-progress";
    chip.setAttribute("aria-hidden", "true");
    chip.innerHTML = '<span class="egg-progress__heart">♥</span><span class="egg-progress__count"></span>';
    document.body.appendChild(chip);
    function updateChip() {
      chip.querySelector(".egg-progress__count").textContent = found + " / " + spots.length;
    }

    spots.forEach(function (spot) {
      var sec = document.getElementById(spot.id);
      if (!sec) return;
      var h = document.createElement("button");
      h.className = "hidden-heart";
      h.setAttribute("aria-label", "A hidden heart");
      h.innerHTML =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M12 21s-7.5-4.9-10-9.2C.3 8.6 1.7 5 5 5c2 0 3.3 1.2 4 2.3C9.7 6.2 11 5 13 5c3.3 0 4.7 3.6 3 6.8C19.5 16.1 12 21 12 21z"/></svg>';
      Object.keys(spot.css).forEach(function (k) { h.style[k] = spot.css[k]; });
      h.addEventListener("click", function (e) {
        e.stopPropagation();
        if (h.classList.contains("found")) return;
        h.classList.add("found");
        found++;
        updateChip();
        chip.classList.add("show");
        var r = h.getBoundingClientRect();
        if (window.firePop) window.firePop(r.left + r.width / 2, r.top + r.height / 2);
        if (window.AudioBus) window.AudioBus.play("pop");
        window.setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 500);
        if (found >= spots.length) {
          window.setTimeout(function () {
            chip.classList.remove("show");
            heartRain(30);
            if (window.fireFireworks) window.fireFireworks(2600);
            window.showSecret(eggs.allFoundTitle || "You found them all", eggs.allFoundMessage || "");
          }, 650);
        } else {
          window.showEggToast((eggs.heartFoundToast || "You found a hidden heart") + " · " + found + "/" + spots.length);
        }
      });
      sec.appendChild(h);
    });
    updateChip();
  }

  /* ------------------------------------------------------------------ */
  /* Type-the-name secret                                               */
  /* ------------------------------------------------------------------ */
  function initTypeName() {
    var name = ((window.CONTENT && window.CONTENT.recipientName) || "").toLowerCase();
    if (!name || name.length < 3) return;
    var buffer = "";
    var fired = false;
    document.addEventListener("keydown", function (e) {
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key && e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-name.length);
        if (!fired && buffer === name) {
          fired = true;
          heartRain(28);
          window.showEggToast(eggs.nameSecret || "💕");
          window.setTimeout(function () { fired = false; }, 4000);
        }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Konami code                                                        */
  /* ------------------------------------------------------------------ */
  function initKonami() {
    var seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    var idx = 0;
    document.addEventListener("keydown", function (e) {
      var key = e.key;
      var expected = seq[idx];
      if (key && key.toLowerCase() === expected.toLowerCase()) {
        idx++;
        if (idx === seq.length) {
          idx = 0;
          heartRain(34);
          if (window.fireFireworks) window.fireFireworks(3400);
          if (window.fireConfetti) window.fireConfetti(3000);
          window.showSecret("✦ Secret unlocked ✦", eggs.konamiSecret || "");
        }
      } else {
        idx = (key === seq[0]) ? 1 : 0;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  window.initEasterEggs = function () {
    eggs = (window.CONTENT && window.CONTENT.easterEggs) || {};
    initHearts();
    initTypeName();
    initKonami();
  };
})();
