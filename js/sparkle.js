/* ============================================================================
   sparkle.js — a soft sparkle/heart trail that follows the cursor.
   Desktop (fine pointer) only, and never when reduced motion is requested.
   Exposes: window.initSparkle()
   ========================================================================== */
(function () {
  "use strict";

  function now() { return (window.performance && performance.now) ? performance.now() : +new Date(); }

  window.initSparkle = function () {
    if (window.REDUCED) return;
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    var layer = document.createElement("div");
    layer.id = "sparkle-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    var glyphs = ["✦", "✧", "♡", "·"]; // ✦ ✧ ♡ ·
    var colors = ["var(--rose)", "var(--gold)", "var(--lavender)"];
    var last = 0;

    window.addEventListener("mousemove", function (e) {
      var t = now();
      if (t - last < 42) return; // throttle spawn rate
      last = t;

      var s = document.createElement("span");
      s.className = "sparkle";
      s.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      s.style.left = e.clientX + "px";
      s.style.top = e.clientY + "px";
      s.style.setProperty("--sx", (Math.random() * 26 - 13) + "px");
      s.style.setProperty("--sy", (12 + Math.random() * 22) + "px");
      s.style.fontSize = (8 + Math.random() * 11) + "px";
      s.style.color = colors[(Math.random() * colors.length) | 0];
      layer.appendChild(s);
      window.setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 900);
    }, { passive: true });
  };
})();
