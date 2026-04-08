// Letter scramble word cycling
const words = ["Cloud", "Data", "AI Agents", "AI Assistants", "MCP Servers"];
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
let index = 0;
let scrambleTimer = null;

function scrambleTo(el, word) {
  if (scrambleTimer) clearInterval(scrambleTimer);
  let iteration = 0;

  scrambleTimer = setInterval(() => {
    el.textContent = word
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < Math.floor(iteration / 2)) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    iteration++;

    if (iteration > word.length * 2 + 4) {
      clearInterval(scrambleTimer);
      scrambleTimer = null;
      el.textContent = word;
    }
  }, 55);
}

function cycleWord() {
  const el = document.getElementById('cycleWord');
  if (!el) return;
  index = (index + 1) % words.length;
  scrambleTo(el, words[index]);
}

setInterval(cycleWord, 2200);

// ── Hamburger nav ──────────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
const mainNav   = document.getElementById('mainNav');

function closeNav() {
  if (!navMenu) return;
  navMenu.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
}

function openNav() {
  if (!navMenu) return;
  // Sync drawer top with actual nav height so it never overlaps or gaps
  const navH = mainNav.getBoundingClientRect().height;
  navMenu.style.top = navH + 'px';

  navMenu.classList.add('open');
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close navigation menu');
  // Lock body scroll while drawer is open
  document.body.style.overflow = 'hidden';
}

if (navToggle && navMenu) {
  // Toggle on click
  navToggle.addEventListener('click', e => {
    e.stopPropagation();
    navMenu.classList.contains('open') ? closeNav() : openNav();
  });

  // Close when any link inside the drawer is tapped
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });

  // Close when clicking outside nav entirely
  document.addEventListener('click', e => {
    if (
      navMenu.classList.contains('open') &&
      !mainNav.contains(e.target)
    ) {
      closeNav();
    }
  });

  // Close drawer when viewport is resized above mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeNav();
  });
}
