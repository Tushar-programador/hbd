/* ============================================================================
   love-letter.js — Chapter 4: wax-sealed envelope → unfold → typewriter letter
   Exposes: window.initLoveLetter()
   ========================================================================== */
(function () {
  "use strict";

  function typeWriter(el, text, done) {
    if (!el) { if (done) done(); return; }
    if (window.REDUCED) {
      el.textContent = text;
      el.classList.remove("typing");
      if (done) done();
      return;
    }
    el.textContent = "";
    el.classList.add("typing");
    var i = 0;
    var base = 26; // ms per character
    (function step() {
      if (i >= text.length) {
        el.classList.remove("typing");
        if (done) done();
        return;
      }
      var ch = text.charAt(i++);
      el.appendChild(document.createTextNode(ch));
      var delay = ch === "\n" ? 240 : base + Math.random() * 30;
      window.setTimeout(step, delay);
    })();
  }

  window.initLoveLetter = function () {
    var C = (window.CONTENT && window.CONTENT.loveLetter) || {};
    var env = document.getElementById("envelope");
    var paper = document.getElementById("letter-paper");
    var bodyEl = document.getElementById("letter-body");
    var signoffEl = document.getElementById("letter-signoff");
    var signEl = document.getElementById("letter-signature");
    if (!env || !paper || !bodyEl) return;

    var opened = false;
    function open() {
      if (opened) return;
      opened = true;
      env.classList.add("is-open");
      env.setAttribute("aria-label", "Letter opened");
      if (window.AudioBus) window.AudioBus.play("open");

      var delay = window.REDUCED ? 0 : 720;
      window.setTimeout(function () {
        paper.classList.add("is-visible");
        paper.setAttribute("aria-hidden", "false");
        typeWriter(bodyEl, C.body || "", function () {
          if (signoffEl) { signoffEl.textContent = C.signoff || ""; signoffEl.classList.add("show"); }
          if (signEl) { signEl.textContent = C.signature || ""; signEl.classList.add("show"); }
        });
      }, delay);
    }

    env.addEventListener("click", open);
    env.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  };
})();
