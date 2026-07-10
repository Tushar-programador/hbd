/* ============================================================================
   music-player.js — Chapter 3: playlist list + persistent mini player (Howler)
   Degrades gracefully: with no .mp3 files present the UI still works, it just
   makes no sound. Exposes: window.initMusicPlayer()
   ========================================================================== */
(function () {
  "use strict";

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  window.initMusicPlayer = function () {
    var C = (window.CONTENT && window.CONTENT.music) || {};
    var list = C.playlist || [];

    var listEl = document.getElementById("playlist");
    var player = document.getElementById("mini-player");
    var titleEl = document.getElementById("mp-title");
    var noteEl = document.getElementById("mp-note");
    var playBtn = document.getElementById("mp-play");
    var prevBtn = document.getElementById("mp-prev");
    var nextBtn = document.getElementById("mp-next");
    var volEl = document.getElementById("mp-volume");
    var collapseBtn = document.getElementById("mp-collapse");

    var howls = [];
    var trackEls = [];
    var current = 0;
    var playing = false;

    /* --- Build the playlist section --- */
    if (listEl) {
      var built = [];
      list.forEach(function (song, i) {
        var li = document.createElement("li");
        li.className = "track reveal";
        li.setAttribute("data-reveal", "");

        var playCol = document.createElement("button");
        playCol.className = "track__play";
        playCol.setAttribute("aria-label", "Play " + (song.title || "song " + (i + 1)));
        playCol.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

        var index = document.createElement("span");
        index.className = "track__index";
        index.textContent = pad(i + 1);

        var meta = document.createElement("span");
        meta.className = "track__meta";
        var t = document.createElement("span"); t.className = "track__title"; t.textContent = song.title || "";
        var a = document.createElement("span"); a.className = "track__artist"; a.textContent = song.artist || "";
        meta.appendChild(t); meta.appendChild(a);

        var note = document.createElement("span");
        note.className = "track__note";
        note.textContent = song.note || "";

        li.appendChild(playCol);
        li.appendChild(index);
        li.appendChild(meta);
        li.appendChild(note);

        (function (idx) {
          playCol.addEventListener("click", function () { selectAndPlay(idx); });
          li.addEventListener("click", function (e) {
            if (e.target.closest(".track__play")) return;
            selectAndPlay(idx);
          });
        })(i);

        listEl.appendChild(li);
        trackEls.push(li);
        built.push(li);
      });
      if (window.staggerReveal) window.staggerReveal(built, 0.06);
      // Tracks are built after initReveal wired the observer, so register them now.
      if (window.revealObserve) window.revealObserve(built);
    }

    // Seed the global volume once so loudness is driven from a single control.
    try { if (window.Howler && volEl) window.Howler.volume(volEl.value / 100); } catch (e) {}

    /* --- Howl management (lazy, guarded) --- */
    function getHowl(i) {
      if (howls[i]) return howls[i];
      if (!window.Howl || !list[i] || !list[i].src) return null;
      try {
        var h = new window.Howl({
          src: [list[i].src],
          html5: true,
          // Per-howl volume stays at 1; loudness is driven by the global
          // Howler.volume() so the slider isn't applied twice.
          volume: 1,
          onend: function () { next(); },
          onloaderror: function () {},
          onplayerror: function () {},
        });
        if (window.AudioBus) window.AudioBus.register(h);
        howls[i] = h;
        return h;
      } catch (e) { return null; }
    }

    function stopCurrent() {
      var h = howls[current];
      if (h) { try { h.stop(); } catch (e) {} }
    }

    function updateMeta() {
      var song = list[current] || {};
      if (titleEl) titleEl.textContent = song.title || "—";
      if (noteEl) noteEl.textContent = song.note || (song.artist || "");
      trackEls.forEach(function (el, i) {
        el.classList.toggle("is-active", i === current && playing);
      });
    }

    function updatePlayIcon() {
      if (!playBtn) return;
      var ip = playBtn.querySelector(".ic-play");
      var ipp = playBtn.querySelector(".ic-pause");
      if (ip) ip.style.display = playing ? "none" : "block";
      if (ipp) ipp.style.display = playing ? "block" : "none";
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    }

    function expand() { if (player) player.setAttribute("data-collapsed", "false"); }

    function play() {
      var h = getHowl(current);
      // Clicking play implies she wants to hear it — lift the master mute.
      if (window.AudioBus && window.AudioBus.muted) {
        window.AudioBus.setMuted(false);
        if (window.syncMuteUI) window.syncMuteUI();
      }
      if (h) { try { h.play(); } catch (e) {} }
      playing = true;
      updatePlayIcon();
      updateMeta();
      expand();
    }

    function pause() {
      var h = howls[current];
      if (h) { try { h.pause(); } catch (e) {} }
      playing = false;
      updatePlayIcon();
      updateMeta();
    }

    function selectAndPlay(i) {
      if (i === current && playing) { pause(); return; }
      if (i !== current) { stopCurrent(); current = i; }
      play();
    }

    function next() { stopCurrent(); current = (current + 1) % Math.max(1, list.length); play(); }
    function prev() { stopCurrent(); current = (current - 1 + Math.max(1, list.length)) % Math.max(1, list.length); play(); }

    /* --- Wire controls --- */
    if (playBtn) playBtn.addEventListener("click", function () { playing ? pause() : play(); });
    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (volEl) volEl.addEventListener("input", function () {
      try { if (window.Howler) window.Howler.volume(volEl.value / 100); } catch (e) {}
    });
    if (collapseBtn && player) {
      collapseBtn.addEventListener("click", function () {
        var collapsed = player.getAttribute("data-collapsed") === "true";
        player.setAttribute("data-collapsed", collapsed ? "false" : "true");
        collapseBtn.setAttribute("aria-label", collapsed ? "Hide music player" : "Show music player");
      });
    }

    // Hide the player entirely if there are no songs configured.
    if (player && list.length === 0) player.style.display = "none";

    updateMeta();
    updatePlayIcon();
  };
})();
