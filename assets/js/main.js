/* CII Nilgiris Economic Dialogue — site interactions (no dependencies) */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header shadow + mobile menu ---------- */
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".menu-toggle");
  var navLinks = document.querySelectorAll(".nav-links a");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
    toggle.setAttribute("aria-expanded", String(open));
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
  }
  navLinks.forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false);
  });

  /* ---------- active nav item (scroll spy) ---------- */
  var linkFor = {};
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    (a.dataset.spy || id).split(",").forEach(function (s) { linkFor[s.trim()] = a; });
  });
  var spied = Object.keys(linkFor).map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ("IntersectionObserver" in window && spied.length) {
    var current = null;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var link = linkFor[en.target.id];
        if (link && link !== current) {
          if (current) current.classList.remove("is-active");
          link.classList.add("is-active");
          current = link;
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spied.forEach(function (el) { spy.observe(el); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); ro.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10) || 0;
    var suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- gallery "show all" ---------- */
  var gallery = document.querySelector(".gallery");
  var moreBtn = document.querySelector("[data-gallery-more]");
  if (gallery && moreBtn) {
    moreBtn.addEventListener("click", function () {
      var collapsed = gallery.classList.toggle("is-collapsed");
      moreBtn.querySelector("span").textContent = collapsed ? moreBtn.dataset.more : moreBtn.dataset.less;
      if (collapsed) gallery.scrollIntoView({ block: "start" });
    });
  }

  /* ---------- steering committee "show all" (phones) ---------- */
  var roster = document.getElementById("roster");
  var rosterBtn = document.querySelector("[data-roster-more]");
  if (roster && rosterBtn) {
    rosterBtn.addEventListener("click", function () {
      var collapsed = roster.classList.toggle("is-collapsed");
      rosterBtn.setAttribute("aria-expanded", String(!collapsed));
      rosterBtn.querySelector("span").textContent = collapsed ? rosterBtn.dataset.more : rosterBtn.dataset.less;
      if (collapsed) roster.scrollIntoView({ block: "start" });
    });
  }

  /* ---------- lightbox (gallery photos + speaker flyers) ---------- */
  var lb = document.querySelector(".lightbox");
  var lbImg = lb.querySelector("img");
  var lbCap = lb.querySelector(".lb-caption");
  var group = [], index = 0, lastFocus = null;

  function show(i) {
    index = (i + group.length) % group.length;
    var item = group[index];
    lbImg.src = item.dataset.full;
    lbImg.alt = item.dataset.caption || "";
    lbCap.textContent = item.dataset.caption || "";
    lb.querySelector(".lb-prev").hidden = lb.querySelector(".lb-next").hidden = group.length < 2;
  }
  function open(trigger) {
    var name = trigger.dataset.group;
    group = Array.prototype.slice.call(document.querySelectorAll('[data-group="' + name + '"]'));
    lastFocus = trigger;
    show(group.indexOf(trigger));
    lb.classList.add("is-open");
    document.body.classList.add("no-scroll");
    lb.querySelector(".lb-close").focus();
  }
  function close() {
    lb.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    lbImg.removeAttribute("src");
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-full]");
    if (t) { e.preventDefault(); open(t); }
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  /* ---------- testimonials slider ---------- */
  var track = document.querySelector(".t-track");
  if (track) {
    var prev = document.querySelector("[data-t-prev]");
    var next = document.querySelector("[data-t-next]");
    var bar = document.querySelector(".t-progress i");
    function stepSize() {
      var card = track.querySelector(".t-card");
      return card ? card.getBoundingClientRect().width + 20 : track.clientWidth;
    }
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var pos = track.scrollLeft;
      prev.disabled = pos <= 4;
      next.disabled = pos >= max - 4;
      var visible = track.clientWidth / track.scrollWidth;
      bar.style.width = (visible * 100) + "%";
      bar.style.marginLeft = (max > 0 ? (pos / max) * (100 - visible * 100) : 0) + "%";
    }
    prev.addEventListener("click", function () { track.scrollBy({ left: -stepSize(), behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: stepSize(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- footer year ---------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = "2026";
})();
