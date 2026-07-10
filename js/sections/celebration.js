/* ============================================================================
   celebration.js — Chapter 1: cake + candle, and the shared confetti /
   fireworks engine (also used by the Final Surprise).
   Exposes: window.fireConfetti(ms), window.fireFireworks(ms), initCelebration()
   ========================================================================== */
(function () {
  "use strict";

  var canvas = null, ctx = null;
  var VW = 0, VH = 0;
  var particles = [];
  var running = false;
  var rafId = null;
  var endTime = 0;
  var timers = [];

  var COLORS = ["#E4899B", "#B9A6DD", "#BE9B4E", "#D8BE84", "#F7DBE0", "#ffffff"];

  function now() { return (window.performance && performance.now) ? performance.now() : +new Date(); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function ensureCanvas() {
    if (ctx) return true;
    canvas = document.getElementById("fx-canvas");
    if (!canvas) return false;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
    return true;
  }

  function resize() {
    if (!canvas || !ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    VW = window.innerWidth;
    VH = window.innerHeight;
    canvas.width = Math.floor(VW * dpr);
    canvas.height = Math.floor(VH * dpr);
    canvas.style.width = VW + "px";
    canvas.style.height = VH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawnConfetti(n) {
    for (var i = 0; i < n; i++) {
      particles.push({
        type: "confetti",
        x: rand(0, VW), y: rand(-60, -10),
        vx: rand(-0.8, 0.8), vy: rand(2, 5),
        w: rand(6, 11), h: rand(9, 16),
        rot: rand(0, Math.PI * 2), vrot: rand(-0.25, 0.25),
        color: pick(COLORS),
        life: 1, decay: rand(0.003, 0.006),
      });
    }
  }

  function spawnFireworkBurst(cx, cy) {
    var count = 34, hue = pick(COLORS);
    for (var i = 0; i < count; i++) {
      var ang = (Math.PI * 2 * i) / count + rand(-0.12, 0.12);
      var spd = rand(2.2, 5.6);
      particles.push({
        type: "spark",
        x: cx, y: cy,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        color: hue,
        size: rand(2, 3.6),
        life: 1, decay: rand(0.012, 0.022),
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, VW, VH);
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      if (p.type === "confetti") {
        p.vy += 0.08;
        p.x += p.vx; p.y += p.vy; p.rot += p.vrot;
        p.life -= p.decay;
        if (p.y > VH + 40 || p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      } else {
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.03;
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    if (particles.length > 0 || now() < endTime) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      running = false;
      rafId = null;
      ctx.clearRect(0, 0, VW, VH);
    }
  }

  function start() {
    if (!running) { running = true; rafId = window.requestAnimationFrame(tick); }
  }

  function staticBurst() {
    if (!ctx) return;
    ctx.clearRect(0, 0, VW, VH);
    for (var i = 0; i < 70; i++) {
      ctx.save();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = pick(COLORS);
      var x = rand(0, VW), y = rand(0, VH * 0.75);
      ctx.translate(x, y); ctx.rotate(rand(0, Math.PI * 2));
      ctx.fillRect(-5, -6, 10, 12);
      ctx.restore();
    }
    var t = setTimeout(function () { if (ctx) ctx.clearRect(0, 0, VW, VH); }, 1600);
    timers.push(t);
  }

  window.fireConfetti = function (ms) {
    ms = ms || 2500;
    if (!ensureCanvas()) return;
    if (window.REDUCED) { staticBurst(); return; }
    endTime = Math.max(endTime, now() + ms);
    spawnConfetti(90);
    var stop = now() + ms - 500;
    var iv = setInterval(function () {
      if (now() < stop) spawnConfetti(22);
      else clearInterval(iv);
    }, 220);
    timers.push(iv);
    start();
  };

  window.fireFireworks = function (ms) {
    ms = ms || 2500;
    if (!ensureCanvas()) return;
    if (window.REDUCED) { staticBurst(); return; }
    endTime = Math.max(endTime, now() + ms);
    function launch() { spawnFireworkBurst(rand(VW * 0.2, VW * 0.8), rand(VH * 0.18, VH * 0.5)); }
    launch(); launch();
    var stop = now() + ms - 600;
    var iv = setInterval(function () {
      if (now() < stop) launch();
      else clearInterval(iv);
    }, 540);
    timers.push(iv);
    start();
  };

  window.initCelebration = function () {
    ensureCanvas();
    var cake = document.getElementById("cake");
    if (!cake) return;
    var done = false;
    function blow() {
      if (done) return;
      done = true;
      cake.classList.add("is-blown");
      cake.setAttribute("aria-label", "The candle is out. Happy birthday!");
      if (window.AudioBus) window.AudioBus.play("confetti");
      window.fireConfetti(2600);
      window.fireFireworks(2800);
    }
    cake.addEventListener("click", blow);
    cake.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); blow(); }
    });
  };
})();
