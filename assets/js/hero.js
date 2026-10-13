/* Animated hero background: a dotted "data terrain" with rising light pins.
   Original drawing code. Pauses off-screen and in hidden tabs; static under prefers-reduced-motion. */
(function () {
  "use strict";
  var canvas = document.getElementById("hero-canvas");
  if (!canvas || !canvas.getContext) { return; }
  var ctx = canvas.getContext("2d");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var w = 0, h = 0, pins = [], t = 0, last = 0, raf = null;
  var running = false, inView = true;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function newPin(initial) {
    var violet = Math.random() < 0.62;
    return {
      x: rand(0, w),
      base: rand(h * 0.5, h * 0.98),
      len: rand(h * 0.08, h * 0.42),
      r: rand(2.2, 6.5),
      color: violet ? "#8b5cf6" : "#c04bd6",
      glow: violet ? "rgba(139,92,246,0.9)" : "rgba(192,75,214,0.9)",
      period: rand(6, 16),
      life: initial ? Math.random() : 0,
      alpha: rand(0.35, 0.9)
    };
  }

  function seed() {
    var n = Math.round(Math.min(72, Math.max(22, w / 20)));
    pins = [];
    for (var i = 0; i < n; i++) { pins.push(newPin(true)); }
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function draw(dt) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#120826");
    g.addColorStop(1, "#1b0b3f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    /* dotted terrain: rows of points on two superposed waves */
    var rows = 16;
    var cols = Math.max(40, Math.round(w / 12));
    for (var r = 0; r < rows; r++) {
      var depth = r / (rows - 1);
      var y0 = h * 0.52 + depth * h * 0.46;
      var amp = 14 + 22 * depth;
      ctx.fillStyle = "rgba(167,139,250," + (0.10 + depth * 0.45).toFixed(3) + ")";
      for (var c = 0; c <= cols; c++) {
        var x = (c / cols) * w;
        var y = y0
          + Math.sin(x * 0.011 + t * 0.55 + depth * 2.2) * amp
          + Math.sin(x * 0.0042 - t * 0.28 + depth) * amp * 0.9;
        ctx.fillRect(x, y, 1.6, 1.6);
      }
    }

    /* light pins */
    ctx.lineWidth = 1.2;
    for (var i = 0; i < pins.length; i++) {
      var p = pins[i];
      p.life += dt / p.period;
      if (p.life >= 1) { pins[i] = p = newPin(false); }
      var ease = Math.sin(p.life * Math.PI);
      var bottom = p.base - p.len * 0.25 * p.life;
      var top = bottom - p.len;
      var lg = ctx.createLinearGradient(0, top, 0, bottom);
      lg.addColorStop(0, p.color);
      lg.addColorStop(1, "rgba(139,92,246,0)");
      ctx.globalAlpha = p.alpha * ease;
      ctx.strokeStyle = lg;
      ctx.beginPath();
      ctx.moveTo(p.x, bottom);
      ctx.lineTo(p.x, top);
      ctx.stroke();
      ctx.shadowColor = p.glow;
      ctx.shadowBlur = 14;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, top, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function frame(ts) {
    if (!running) { return; }
    var dt = Math.min((ts - last) / 1000, 0.05);
    last = ts;
    t += dt;
    draw(dt);
    raf = window.requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduceMotion || !inView) { return; }
    running = true;
    last = window.performance.now();
    raf = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (raf) { window.cancelAnimationFrame(raf); raf = null; }
  }

  resize();
  window.addEventListener("resize", function () {
    resize();
    if (reduceMotion) { draw(0); }
  });

  if (reduceMotion) {
    t = 2.5;
    draw(0);
    return;
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) { start(); } else { stop(); }
    }, { threshold: 0.05 }).observe(canvas);
  } else {
    start();
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); } else { start(); }
  });
  window.addEventListener("pageshow", start);
  /* Belt and braces: if a transient hidden state swallowed the first start, pick it up here. */
  window.setTimeout(start, 800);
  window.setTimeout(start, 2500);
})();
