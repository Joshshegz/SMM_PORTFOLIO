(function () {
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var mobileMenuBreakpoint = 760;

  function initMobileMenu() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav-links");
    if (!header || !toggle || !nav) return;

    function closeMenu() {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    function openMenu() {
      header.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }

    toggle.addEventListener("click", function () {
      if (header.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu();
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > mobileMenuBreakpoint) {
        closeMenu();
      }
    });
  }

  function initScrollReveal() {
    var revealSelectors = [
      ".hero__inner",
      ".hero__card",
      "#about .about__photo",
      "#about .about__body",
      "#about .about-point",
      "#services .section__intro",
      "#services .card",
      ".proof .proof__stat",
      ".proof .proof__line",
      "#portfolio .section__intro",
      "#portfolio .portfolio-item",
      "#testimonials .section__intro",
      "#testimonials .testimonial",
      "#tools .section__intro",
      "#tools .tool-bubble",
      "#contact .section__intro",
      "#contact .form-card",
      ".final-cta__band .wrap > h2",
      ".final-cta__band .wrap > p",
      ".final-cta__band .final-cta__actions"
    ];

    var revealNodes = document.querySelectorAll(revealSelectors.join(", "));
    if (!revealNodes.length) return;

    revealNodes.forEach(function (node) {
      node.classList.add("reveal");
    });

    var staggerGroups = [
      document.querySelectorAll("#services .card"),
      document.querySelectorAll("#portfolio .portfolio-item"),
      document.querySelectorAll("#tools .tool-bubble"),
      document.querySelectorAll("#testimonials .testimonial"),
      document.querySelectorAll("#about .about-point")
    ];

    staggerGroups.forEach(function (group) {
      group.forEach(function (node, index) {
        node.setAttribute("data-reveal-delay", String((index % 6) + 1));
      });
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealNodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function initToolsScatter() {
    var cloud = document.querySelector(".tools-cloud");
    if (!cloud) return;

    var bubbles = cloud.querySelectorAll(".tool-bubble");
    if (!bubbles.length) return;
    if (prefersReducedMotion) return;

    bubbles.forEach(function (bubble, index) {
      var seedX = ((index % 4) - 1.5) * 0.6;
      var seedY = ((index % 3) - 1) * 0.6;
      bubble.dataset.seedX = String(seedX);
      bubble.dataset.seedY = String(seedY);
    });

    function scatter(clientX, clientY) {
      bubbles.forEach(function (bubble) {
        var rect = bubble.getBoundingClientRect();
        var bx = rect.left + rect.width / 2;
        var by = rect.top + rect.height / 2;
        var dx = bx - clientX;
        var dy = by - clientY;
        var dist = Math.hypot(dx, dy) || 0.001;
        var radius = 180;
        var force = Math.max(0, (radius - dist) / radius);
        var push = force * 26;
        var ux = dx / dist;
        var uy = dy / dist;
        var seedX = parseFloat(bubble.dataset.seedX || "0");
        var seedY = parseFloat(bubble.dataset.seedY || "0");
        var tx = ux * push + seedX;
        var ty = uy * push + seedY;
        bubble.style.transform = "translate(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px)";
      });
    }

    cloud.addEventListener("pointerenter", function (event) {
      cloud.classList.add("is-scatter");
      scatter(event.clientX, event.clientY);
    });

    cloud.addEventListener("pointermove", function (event) {
      if (!cloud.classList.contains("is-scatter")) return;
      scatter(event.clientX, event.clientY);
    });

    cloud.addEventListener("pointerleave", function () {
      cloud.classList.remove("is-scatter");
      bubbles.forEach(function (bubble) {
        bubble.style.transform = "";
      });
    });
  }

  var el = document.getElementById("hero-type");
  if (!el) return;

  var lines = [
    "Social Media Strategist",
    "Turning content into clients",
    "Helping brands get seen",
    "Growth systems that scale",
    "No fluff. Just results"
  ];

  var typeMs = 32;
  var deleteMs = 18;
  var holdMs = 2000;
  var betweenMs = 100;

  if (prefersReducedMotion) {
    initMobileMenu();
    initScrollReveal();
    initToolsScatter();
    el.textContent = lines[0];
    return;
  }

  var i = 0;
  var j = 0;
  var deleting = false;

  function step() {
    var line = lines[i];
    if (!deleting) {
      if (j < line.length) {
        j += 1;
        el.textContent = line.slice(0, j);
        setTimeout(step, typeMs);
      } else {
        setTimeout(function () {
          deleting = true;
          step();
        }, holdMs);
      }
    } else if (j > 0) {
      j -= 1;
      el.textContent = line.slice(0, j);
      setTimeout(step, deleteMs);
    } else {
      deleting = false;
      i = (i + 1) % lines.length;
      setTimeout(step, betweenMs);
    }
  }

  initMobileMenu();
  initScrollReveal();
  initToolsScatter();
  step();
})();
