(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var navToggle = document.getElementById("nav-toggle");
  var primaryNav = document.getElementById("primary-nav");
  var navLinks = Array.prototype.slice.call(
    primaryNav ? primaryNav.querySelectorAll('a[href^="#"]') : []
  );
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id]")
  );

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  function openNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close navigation menu");
  }

  function closeNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation menu");
  }

  function toggleNav() {
    if (!navToggle) return;
    if (navToggle.getAttribute("aria-expanded") === "true") {
      closeNav();
    } else {
      openNav();
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", toggleNav);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  setHeaderState();

  if ("IntersectionObserver" in window) {
    var revealTargets = document.querySelectorAll("[data-reveal]");

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (target, index) {
      target.style.transitionDelay = Math.min(index * 60, 240) + "ms";
      revealObserver.observe(target);
    });

    var activeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {
            var isMatch =
              link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", isMatch);
          });
        });
      },
      { threshold: 0.1, rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      activeObserver.observe(section);
    });
  } else {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-reveal]"),
      function (target) {
        target.classList.add("is-visible");
      }
    );
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var motionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  var prefersReduced = motionQuery ? motionQuery.matches : false;

  function initTilt() {
    if (prefersReduced || window.matchMedia("(hover: none)").matches) return;

    var tiltTargets = Array.prototype.slice.call(
      document.querySelectorAll("[data-tilt]")
    );

    tiltTargets.forEach(function (card) {
      var bounds = null;
      var ticking = false;
      var nextX = 0;
      var nextY = 0;

      function apply() {
        ticking = false;
        if (!bounds) return;
        card.style.setProperty("--tilt-x", nextY.toFixed(2) + "deg");
        card.style.setProperty("--tilt-y", nextX.toFixed(2) + "deg");
      }

      function onMove(event) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var px = (event.clientX - bounds.left) / bounds.width;
        var py = (event.clientY - bounds.top) / bounds.height;
        nextX = (px - 0.5) * 14;
        nextY = (0.5 - py) * 14;
        card.style.setProperty("--glare-x", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--glare-y", (py * 100).toFixed(1) + "%");
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(apply);
        }
      }

      function onEnter() {
        bounds = card.getBoundingClientRect();
        card.classList.add("is-tilting");
      }

      function onLeave() {
        bounds = null;
        card.classList.remove("is-tilting");
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      }

      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerleave", onLeave);
    });
  }

  function initCertificates() {
    var modal = document.getElementById("cert-modal");
    var frame = document.getElementById("cert-frame");
    var titleEl = document.getElementById("cert-modal-title");
    var downloadEl = document.getElementById("cert-modal-download");
    var closeEls = Array.prototype.slice.call(
      document.querySelectorAll("[data-cert-close]")
    );
    var lastFocused = null;

    if (!modal || !frame) return;

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      frame.removeAttribute("src");
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    function open(trigger) {
      var src = trigger.getAttribute("data-cert-open");
      var title = trigger.getAttribute("data-cert-title") || "Certificate";
      lastFocused = trigger;
      frame.setAttribute("src", src);
      frame.setAttribute("title", title);
      if (titleEl) titleEl.textContent = title;
      if (downloadEl) {
        downloadEl.setAttribute("href", src);
        downloadEl.setAttribute(
          "download",
          src.split("/").pop() || "certificate.pdf"
        );
      }
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }

    Array.prototype.forEach.call(
      document.querySelectorAll("[data-cert-open]"),
      function (trigger) {
        trigger.addEventListener("click", function (event) {
          event.preventDefault();
          open(trigger);
        });
      }
    );

    closeEls.forEach(function (el) {
      el.addEventListener("click", close);
    });

    modal.addEventListener("click", function (event) {
      if (event.target === modal) close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        close();
      }
    });
  }

  function initCertificateFlip() {
    Array.prototype.forEach.call(
      document.querySelectorAll(".cert-card"),
      function (card) {
        card.setAttribute("aria-expanded", "false");

        function toggleFlip() {
          var flipped = card.classList.toggle("is-flipped");
          card.setAttribute("aria-expanded", flipped ? "true" : "false");
        }

        card.addEventListener("click", function (event) {
          if (event.target.closest("a, button")) return;
          toggleFlip();
        });

        Array.prototype.forEach.call(
          card.querySelectorAll("[data-cert-flip]"),
          function (button) {
            button.addEventListener("click", function (event) {
              event.preventDefault();
              toggleFlip();
            });
          }
        );
      }
    );
  }

  initTilt();
  initCertificates();
  initCertificateFlip();
})();
