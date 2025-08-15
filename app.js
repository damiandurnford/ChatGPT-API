// app.js
const chatLog = document.getElementById('chatLog');
document.getElementById('sendBtn').addEventListener('click', () => {
  const userMessage = document.getElementById('userInput').value.trim();
  if (!userMessage) return;
  appendMessage('You', userMessage);
  sendMessage(userMessage);
  document.getElementById('userInput').value = '';
});

document.getElementById('userInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    document.getElementById('sendBtn').click();
  }
});

function appendMessage(sender, text) {
  let color = sender === 'You' ? 'green' : 'red';
  chatLog.innerHTML += `<span style="color:${color}">${sender}: ${text}</span><br>`;
}

async function sendMessage(message) {
  const response = await fetch('/chat', { // <-- changed from http://localhost:3000/chat
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message
    })
  });
  
  const data = await response.json();
  appendMessage('AI', data.reply);
}
