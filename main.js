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
