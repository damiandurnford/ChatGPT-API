// darkmode.js
const btn = document.getElementById('darkModeBtn');

btn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Switch icon 🌙 <-> ☀️
  if (document.body.classList.contains('dark-mode')) {
    btn.textContent = '☀️';
  } else {
    btn.textContent = '🌙';
  }
});