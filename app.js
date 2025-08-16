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
  let color = sender === 'You' ? 'lightgreen' : 'sandybrown';
  chatLog.innerHTML += `<div style="background-color:${color}; padding:5px; line-height: 20px;     border-radius: 6px; width: 90%">${text}</div><br>`;
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Handle choice buttons (1, 2, 3)
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
  thinkingDiv.style.backgroundColor = 'sandybrown';
  thinkingDiv.style.padding = '5px';
  thinkingDiv.style.marginLeft = '10%';
  thinkingDiv.style.lineHeight = '20px';
  thinkingDiv.textContent = 'THINKING 💬';
  thinkingDiv.style.borderRadius = '6px';
  thinkingDiv.style.animation = 'pulse 1s infinite';
  chatLog.appendChild(thinkingDiv);
  chatLog.scrollTop = chatLog.scrollHeight;

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
  aiDiv.style.backgroundColor = 'sandybrown';
  aiDiv.style.padding = '5px';
  aiDiv.style.marginLeft = '10%';  
  aiDiv.style.lineHeight = '20px';
  aiDiv.style.borderRadius = '6px';
  aiDiv.style.marginBottom = '50px'; 
  chatLog.appendChild(aiDiv);

  const text = `${data.reply}`;
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      aiDiv.textContent += text.charAt(i);
      i++;
      chatLog.scrollTop = chatLog.scrollHeight;
      setTimeout(typeChar, .1); // 30ms per character
    }
  }

  typeChar();
}


// PWA: Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}