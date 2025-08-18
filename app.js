// app.js
const chatLog = document.getElementById('chatLog');
document.getElementById('sendBtn').addEventListener('click', () => {
  const userMessage = document.getElementById('userInput').value.trim();
  if (!userMessage) return;
  appendMessage('You', userMessage);
  sendMessage(userMessage);
  document.getElementById('userInput').value = '';
});

document.getElementById('userInput').addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    document.getElementById('sendBtn').click();
  }
});

function appendMessage(sender, text) {
  let color = sender === 'You' ? 'lightgreen' : 'indigo';
  chatLog.innerHTML += `<div style="background-color:${color}; padding:5px; line-height: 20px; border-radius: 6px; width: 90%">${text}</div><br>`;
  chatLog.scrollTop = chatLog.scrollHeight;
}

document.querySelectorAll('.choice').forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.textContent.trim();
    appendMessage('You', choice);
    sendMessage(choice);
  });
});

async function sendMessage(message) {
  // Add inline thinking indicator
  const thinkingDiv = document.createElement('div');
  thinkingDiv.style.backgroundColor = 'indigo';
  thinkingDiv.style.color = 'white';
  thinkingDiv.style.padding = '5px';
  thinkingDiv.style.marginLeft = '10%';
  thinkingDiv.style.lineHeight = '20px';
  thinkingDiv.textContent = 'THINKING 💬';
  thinkingDiv.style.borderRadius = '6px';
  thinkingDiv.style.animation = 'pulse 1s infinite';
  thinkingDiv.style.marginBottom = '30px';
  chatLog.appendChild(thinkingDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
  window.scrollTo(0, document.body.scrollHeight);

  const response = await fetch('/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await response.json();

  // Remove thinking indicator
  thinkingDiv.remove();

  // Append actual AI response character by character
  const aiDiv = document.createElement('div');
  aiDiv.style.backgroundColor = 'indigo';
  aiDiv.style.color = 'white';
  aiDiv.style.padding = '5px';
  aiDiv.style.marginLeft = '10%';
  aiDiv.style.lineHeight = '20px';
  aiDiv.style.borderRadius = '6px';
  aiDiv.style.marginBottom = '30px';
  chatLog.appendChild(aiDiv);

  const text = `${data.reply}`;
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      aiDiv.textContent += text.charAt(i);
      i++;
      chatLog.scrollTop = chatLog.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
      setTimeout(typeChar, .1); // 
    }
  }

  typeChar();
}


// PWA: Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('SW registered:', reg);

      // Force it to check for updates on load
      reg.update();

      // Optional: Listen for updates becoming available
      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New version available 🚀');
            // Optionally reload automatically:
            window.location.reload();
          }
        };
      };
    });
  });
}

// Force update when clicking the version button
const versionBtn = document.querySelector('.version');
if (versionBtn) {
  versionBtn.addEventListener('click', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('skipWaiting');
      window.location.reload(); // reload immediately to get new assets
    } else {
      window.location.reload();
    }
  });
}

// Update version button text from manifest.json
fetch('./manifest.json')
  .then(response => response.json())
  .then(manifest => {
    const versionBtn = document.querySelector('.version');
    if (versionBtn && manifest.version) {
      versionBtn.textContent = `(v${manifest.version})`;
    }
  })
  .catch(err => console.error('Could not load manifest.json', err));

// Auto-send "Hi" from AI on startup
window.addEventListener('DOMContentLoaded', () => {
  sendMessage("Hi");
});