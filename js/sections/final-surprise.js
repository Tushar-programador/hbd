/* ============================================================================
   final-surprise.js — Chapter 5: slow-down → gift → confetti/fireworks →
   Ken-Burns slideshow → closing message.
   Exposes: window.initFinalSurprise()
   ========================================================================== */
(function () {
  "use strict";

  window.initFinalSurprise = function () {
    var C = (window.CONTENT && window.CONTENT.final) || {};
    var photos = C.photos || [];

    var section = document.getElementById("chapter-final");
    var btn = document.getElementById("final-gift-btn");
    var intro = document.getElementById("final-intro");
    var stage = document.getElementById("final-stage");
    var slideshow = document.getElementById("slideshow");
    var msgEl = document.getElementById("final-message");
    if (!btn || !stage) return;

    var started = false;
    var messageShown = false;

    function buildMessage() {
      if (!msgEl) return;
      msgEl.textContent = "";
      var parts = (C.message || "").split("\n\n");
      parts.forEach(function (p) {
        var el = document.createElement("p");
        el.textContent = p;
        msgEl.appendChild(el);
      });
    }

    function revealMessage() {
      if (messageShown) return;
      messageShown = true;
      buildMessage();
      if (msgEl) msgEl.classList.add("is-visible");
      if (!window.REDUCED && window.fireFireworks) window.fireFireworks(2600);
    }

    function runSlideshow() {
      if (!slideshow) { revealMessage(); return; }
      slideshow.innerHTML = "";
      var slides = [];
      photos.forEach(function (ph, i) {
        var s = document.createElement("div");
        s.className = "slide";
        var img = document.createElement("img");
        img.src = ph.imagePath;
        img.alt = ph.alt || "A favorite memory";
        img.loading = i === 0 ? "eager" : "lazy";
        img.decoding = "async";
        s.appendChild(img);
        slideshow.appendChild(s);
        slides.push(s);
      });
      if (slides.length === 0) { revealMessage(); return; }

      if (window.REDUCED) {
        slideshow.classList.add("is-grid");
        slides.forEach(function (s) { s.classList.add("show", "static"); });
        window.setTimeout(revealMessage, 500);
        return;
      }

      var idx = 0;
      var per = 3400;
      (function showNext() {
        slides.forEach(function (s) { s.classList.remove("show"); });
        slides[idx].classList.add("show");
        idx++;
        if (idx < slides.length) window.setTimeout(showNext, per);
        else window.setTimeout(revealMessage, per);
      })();
    }

    function open() {
      if (started) return;
      started = true;
      if (section) section.classList.add("is-active");
      if (intro) intro.classList.add("is-gone");
      stage.setAttribute("aria-hidden", "false");
      stage.classList.add("is-visible");
      if (window.AudioBus) window.AudioBus.play("confetti");
      if (window.fireConfetti) window.fireConfetti(3200);
      if (window.fireFireworks) window.fireFireworks(3600);
      runSlideshow();
    }

    btn.addEventListener("click", open);
  };
})();
