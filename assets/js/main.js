/* data-chris24.github.io — small page behaviours, no dependencies except Typed.js on the home page */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Sidebar toggle (below 1200px) */
  var sidebar = document.getElementById("sidebar");
  var toggle = document.querySelector(".nav-toggle");
  if (sidebar && toggle) {
    var setOpen = function (open) {
      sidebar.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(!sidebar.classList.contains("open"));
    });
    sidebar.querySelectorAll("nav a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sidebar.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* Highlight the nav link for the section in view (home page only) */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.sidebar nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if (sections.length && "IntersectionObserver" in window) {
    var setActive = function (id) {
      navLinks.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("active", on);
        if (on) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
      });
    };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setActive(entry.target.id); }
      });
    }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && !reduceMotion && "IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { revealer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Typed titles in the hero */
  var typed = document.querySelector(".typed");
  if (typed && window.Typed && !reduceMotion) {
    var items = typed.getAttribute("data-typed-items").split(",").map(function (s) { return s.trim(); });
    new window.Typed(".typed", { strings: items, loop: true, typeSpeed: 90, backSpeed: 45, backDelay: 2200 });
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
