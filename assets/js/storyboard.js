(function () {
  "use strict";

  var DATA_URL = "assets/work/xr-storyboard/storyboard.json";

  // Spatial hotspots drawn over the simulated cell, per frame.
  // "step" numbers the callouts in the order the learner performs them.
  var HOTSPOTS = {
    1: [
      { label: "Emergency stop", x: 41.2, y: 58.6, step: 1 }
    ],
    2: [
      { label: "Housing F-2", x: 56, y: 78, step: 1 },
      { label: "Vent F-1 (not it)", x: 40, y: 68, side: "left" },
      { label: "Vent F-3 (not it)", x: 74, y: 66 }
    ],
    3: [
      { label: "Isolator DOWN", x: 24, y: 62, side: "left", step: 1 },
      { label: "Fit lock + tag", x: 22, y: 75, side: "left", step: 2 },
      { label: "Probe 0 V x3", x: 60, y: 74, step: 3 }
    ],
    4: [
      { label: "Fasteners 1-3-2-4", x: 47, y: 70, side: "left", step: 1 },
      { label: "Open panel", x: 56, y: 80, step: 2 },
      { label: "Hold-open strut", x: 66, y: 64, step: 3 }
    ],
    5: [
      { label: "Release clip", x: 64, y: 70, step: 1 },
      { label: "Place drip tray", x: 47, y: 87, side: "left", step: 2 },
      { label: "Extract cartridge", x: 57, y: 78, step: 3 },
      { label: "Seal waste bag", x: 38, y: 80, side: "left", step: 4 }
    ],
    6: [
      { label: "Wipe seat", x: 57, y: 78, step: 1 },
      { label: "Magnet sweep", x: 64, y: 66, step: 2 },
      { label: "Unseal new filter", x: 74, y: 58, step: 3 },
      { label: "Check gasket + p/n", x: 68, y: 74, step: 4 }
    ],
    7: [
      { label: "Seat filter", x: 57, y: 78, step: 1 },
      { label: "Engage clip", x: 64, y: 72, step: 2 },
      { label: "Fit new gasket", x: 50, y: 70, side: "left", step: 3 },
      { label: "Torque 4-6 N.m", x: 70, y: 82, step: 4 }
    ],
    8: [
      { label: "Remove lock + tag", x: 24, y: 62, side: "left", step: 1 },
      { label: "Run verify cycle", x: 61, y: 44, step: 2 },
      { label: "Confirm READY", x: 70, y: 30, step: 3 },
      { label: "Dispose of waste", x: 40, y: 82, side: "left", step: 4 }
    ]
  };

  var state = { frame: 0, revealed: 0, frames: [], timer: null, view: "interactive" };

  var el = {
    filmstrip: document.getElementById("sb-filmstrip"),
    markers: document.getElementById("sb-markers"),
    fields: document.getElementById("sb-fields"),
    dots: document.getElementById("sb-dots"),
    count: document.getElementById("sb-count"),
    reveal: document.getElementById("sb-reveal"),
    play: document.getElementById("sb-play"),
    reset: document.getElementById("sb-reset"),
    prev: document.getElementById("sb-prev"),
    next: document.getElementById("sb-next"),
    sceneTag: document.getElementById("sb-scene-tag"),
    now: document.getElementById("sb-now"),
    deckImg: document.getElementById("sb-deck-img"),
    schema: document.getElementById("sb-schema"),
    viewport: document.querySelector(".sb-viewport"),
    infoProcedure: document.getElementById("info-procedure"),
    infoModality: document.getElementById("info-modality"),
    infoDisclosure: document.getElementById("info-disclosure"),
    status: document.getElementById("sb-status"),
    slateNum: document.getElementById("sb-slate-num"),
    slateTag: document.getElementById("sb-slate-tag"),
    slateTitle: document.getElementById("sb-slate-title"),
    slatePos: document.getElementById("sb-slate-pos"),
    beatPrompt: document.getElementById("sb-beat-prompt"),
    beatAction: document.getElementById("sb-beat-action"),
    beatSafety: document.getElementById("sb-beat-safety")
  };

  function clearTimer() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function buildSchema(data) {
    el.schema.innerHTML = "";
    data.schema.forEach(function (label, i) {
      var li = document.createElement("li");
      li.innerHTML = "<b>" + (i + 1) + "</b> " + label;
      el.schema.appendChild(li);
    });
  }

  function buildFilmstrip() {
    el.filmstrip.innerHTML = "";
    state.frames.forEach(function (frame, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "sb-film";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", "false");
      btn.dataset.index = String(i);
      btn.innerHTML =
        '<span class="sb-film-num">FRAME ' + String(frame.n).padStart(2, "0") + "</span>" +
        '<span class="sb-film-title"></span>';
      btn.querySelector(".sb-film-title").textContent = frame.title;
      btn.addEventListener("click", function () {
        setFrame(i);
      });
      el.filmstrip.appendChild(btn);
    });
  }

  function renderMarkers(frame) {
    el.markers.innerHTML = "";
    (HOTSPOTS[frame.n] || []).forEach(function (spot) {
      var m = document.createElement("div");
      m.className = "sb-marker is-on" + (spot.side === "left" ? " is-left" : "");
      m.style.left = spot.x + "%";
      m.style.top = spot.y + "%";
      m.innerHTML = '<span class="sb-dot"></span><span class="sb-marker-label"></span>';
      var label = m.querySelector(".sb-marker-label");
      if (spot.step) {
        var stepTag = document.createElement("span");
        stepTag.className = "sb-step";
        stepTag.textContent = String(spot.step);
        label.appendChild(stepTag);
      }
      label.appendChild(document.createTextNode(spot.label));
      el.markers.appendChild(m);
    });
  }

  function renderFields(frame) {
    el.fields.innerHTML = "";
    frame.fields.forEach(function (field, i) {
      var div = document.createElement("div");
      div.className = "sb-field";
      div.dataset.index = String(i);
      div.innerHTML =
        '<span class="sb-field-label"></span><span class="sb-field-value"></span>';
      div.querySelector(".sb-field-label").textContent = field.label;
      div.querySelector(".sb-field-value").textContent = field.value;
      div.addEventListener("click", function () {
        revealUpTo(i + 1);
      });
      el.fields.appendChild(div);
    });
    var dotsWrap = el.dots;
    dotsWrap.innerHTML = "";
    frame.fields.forEach(function () {
      var s = document.createElement("span");
      dotsWrap.appendChild(s);
    });
    applyReveal();
  }

  function applyReveal() {
    var nodes = el.fields.querySelectorAll(".sb-field");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.toggle("is-on", i < state.revealed);
    }
    var dotNodes = el.dots.querySelectorAll("span");
    for (var j = 0; j < dotNodes.length; j++) {
      dotNodes[j].classList.toggle("is-on", j < state.revealed);
    }
    el.count.textContent = state.revealed + " / " + state.frames[state.frame].fields.length;
    el.reveal.disabled = state.revealed >= state.frames[state.frame].fields.length;
  }

  function revealNext() {
    if (state.revealed < state.frames[state.frame].fields.length) {
      state.revealed += 1;
      applyReveal();
    }
  }

  function revealUpTo(n) {
    state.revealed = Math.min(n, state.frames[state.frame].fields.length);
    applyReveal();
  }

  function resetBuild() {
    clearTimer();
    el.play.textContent = "Play build";
    state.revealed = 0;
    applyReveal();
  }
  el.reset.addEventListener("click", resetBuild);

  function setFrame(i) {
    if (i < 0) i = 0;
    if (i > state.frames.length - 1) i = state.frames.length - 1;
    state.frame = i;
    var frame = state.frames[i];

    Array.prototype.forEach.call(el.filmstrip.children, function (node, idx) {
      var active = idx === i;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-selected", active ? "true" : "false");
    });
    var activeNode = el.filmstrip.children[i];
    if (activeNode && activeNode.scrollIntoView) {
      activeNode.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
    }

    el.sceneTag.textContent = "FRAME " + String(frame.n).padStart(2, "0") + " \u00b7 " + frame.tag;
    el.now.innerHTML = "Frame " + frame.n + " of " + state.frames.length;
    el.deckImg.src = "assets/work/xr-storyboard/" + frame.image;
    el.deckImg.alt = "Storyboard slide for frame " + frame.n + ": " + frame.title;

    el.slateNum.textContent = String(frame.n).padStart(2, "0");
    el.slateTag.textContent = frame.tag;
    el.slateTitle.textContent = frame.title;
    el.slatePos.textContent = "Learner: " + frame.fields[3].value;
    el.beatPrompt.textContent = frame.fields[6].value;
    el.beatAction.textContent = frame.fields[7].value;
    el.beatSafety.textContent = frame.fields[10].value;

    renderMarkers(frame);
    renderFields(frame);
    resetBuild();
    el.prev.disabled = i === 0;
    el.next.disabled = i === state.frames.length - 1;
    el.status.textContent = "Frame " + frame.n + " of " + state.frames.length;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  el.next.addEventListener("click", function () { setFrame(state.frame + 1); });
  el.prev.addEventListener("click", function () { setFrame(state.frame - 1); });
  el.reveal.addEventListener("click", revealNext);

  el.play.addEventListener("click", function () {
    if (state.timer) {
      clearTimer();
      el.play.textContent = "Play build";
      return;
    }
    if (state.revealed >= state.frames[state.frame].fields.length) {
      state.revealed = 0;
      applyReveal();
    }
    el.play.textContent = "Pause";
    state.timer = setInterval(function () {
      revealNext();
      if (state.revealed >= state.frames[state.frame].fields.length) {
        clearTimer();
        el.play.textContent = "Play build";
      }
    }, 850);
  });

  Array.prototype.forEach.call(document.querySelectorAll(".sb-seg button"), function (btn) {
    btn.addEventListener("click", function () {
      state.view = btn.dataset.view;
      el.viewport.setAttribute("data-view", state.view);
      Array.prototype.forEach.call(document.querySelectorAll(".sb-seg button"), function (b) {
        b.classList.toggle("is-active", b === btn);
      });
    });
  });

  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowLeft") { setFrame(state.frame - 1); }
    else if (e.key === "ArrowRight") { setFrame(state.frame + 1); }
    else if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); revealNext(); }
    else if (e.key === "r" || e.key === "R") { resetBuild(); }
  });

  fetch(DATA_URL)
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      state.frames = data.frames;
      el.infoProcedure.textContent = data.procedure;
      el.infoModality.textContent = data.modality;
      el.infoDisclosure.textContent = "\u201c" + data.disclosure + "\u201d";
      buildSchema(data);
      buildFilmstrip();
      setFrame(0);
    })
    .catch(function (err) {
      el.filmstrip.innerHTML =
        '<p class="sb-loading">Could not load storyboard data (' + escapeHtml(err.message) +
        "). Open this page from a web server, not a local file.</p>";
    });
})();
