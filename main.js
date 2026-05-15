// main.js — Odiseus Talent
// Handles hero word scramble, mobile navigation, role filtering, custom cursor and reveal animations.

(() => {
  const words = ["Cloud", "Data", "AI Agents", "AI Assistants", "MCP Servers"];
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let wordIndex = 0;
  let scrambleTimer = null;

  function scrambleTo(el, word) {
    if (!el) return;
    if (scrambleTimer) clearInterval(scrambleTimer);

    let iteration = 0;
    scrambleTimer = setInterval(() => {
      el.textContent = word
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < Math.floor(iteration / 2)) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      iteration += 1;

      if (iteration > word.length * 2 + 4) {
        clearInterval(scrambleTimer);
        scrambleTimer = null;
        el.textContent = word;
      }
    }, 55);
  }

  function cycleWord() {
    const el = document.getElementById("cycleWord");
    if (!el) return;
    wordIndex = (wordIndex + 1) % words.length;
    scrambleTo(el, words[wordIndex]);
  }

  window.addEventListener("DOMContentLoaded", () => {
    setInterval(cycleWord, 2200);

    // ── Mobile navigation ────────────────────────────────────────────────
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const mainNav = document.getElementById("mainNav");

    function closeNav() {
      if (!navToggle || !navMenu) return;
      navMenu.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation menu");
      document.body.classList.remove("nav-open");
    }

    function openNav() {
      if (!navToggle || !navMenu || !mainNav) return;

      const navH = Math.round(mainNav.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--nav-h", `${navH}px`);

      navMenu.classList.add("open");
      navToggle.classList.add("open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close navigation menu");
      document.body.classList.add("nav-open");
    }

    if (navToggle && navMenu && mainNav) {
      navToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        navMenu.classList.contains("open") ? closeNav() : openNav();
      });

      navMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeNav);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navMenu.classList.contains("open")) {
          closeNav();
          navToggle.focus();
        }
      });

      document.addEventListener("click", (event) => {
        if (navMenu.classList.contains("open") && !mainNav.contains(event.target)) {
          closeNav();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 768) closeNav();
      });
    }

    // ── Role filters ─────────────────────────────────────────────────────
    const filterButtons = document.querySelectorAll(".filter-btn[data-filter]");
    const roleRows = document.querySelectorAll(".role-row[data-category]");

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        roleRows.forEach((row) => {
          const category = row.dataset.category;
          const shouldShow = filter === "all" || category === filter;
          row.classList.toggle("is-hidden", !shouldShow);
        });
      });
    });

    // ── Custom cursor on desktop/fine pointer only ───────────────────────
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = document.getElementById("cDot");
    const ring = document.getElementById("cRing");

    if (supportsFinePointer && !prefersReducedMotion && dot && ring) {
      document.body.classList.add("custom-cursor-enabled");

      let mouseX = 0;
      let mouseY = 0;
      let ringX = 0;
      let ringY = 0;

      document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
      });

      const animateCursor = () => {
        ringX += (mouseX - ringX) * 0.13;
        ringY += (mouseY - ringY) * 0.13;

        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);
      };

      animateCursor();
    }

    // ── Scroll reveal ────────────────────────────────────────────────────
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window && revealElements.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );

      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add("in"));
    }
  });
})();
