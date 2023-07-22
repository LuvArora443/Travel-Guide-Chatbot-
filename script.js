import process from "./env.js";

const chatContainer = document.getElementById('chat-container');
const setupTextarea = document.getElementById('setup-textarea');
const apiKey = process.env.OPEN_API_KEY;
const url = 'https://api.openai.com/v1/completions';
let conversation = [];

document.getElementById("send-btn").addEventListener("click", () => {
  const prompt = setupTextarea.value;
  if (prompt.trim() !== '') {
    conversation.push(prompt);
    createChatBox(prompt, 'user');
    fetchBotReply();
  } else {
    createChatBox("Please enter a prompt before sending.", 'bot');
  }
});




function fetchBotReply() {
  const prompt = conversation.join("\n");
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      'model': 'text-davinci-003',
      'prompt': `Generate the places in ${prompt} to visit with their rating and a pointised note on the places in points.`,
      'max_tokens': 1000 
    })
  })
  .then(response => response.json())
  .then(data => {
    const botReply = data.choices[0].text.trim();
    conversation.push(botReply);
    createChatBox(formatBotReply(botReply), 'bot');
  })
  .catch(error => {
    createChatBox("An error occurred while processing your request.", 'bot');
    console.error(error);
  });
}

function formatBotReply(reply) {
  return reply.split("\n").map(place => ` ${place.trim()}`).join("<br>");
}

function createChatBox(message, sender) {
  const chatBox = document.createElement('div');
  chatBox.className = 'chat-box';
  chatBox.innerHTML = message; 

  if (sender === 'user') {
    chatBox.classList.add('user-message');
  } else {
    chatBox.classList.add('bot-message');
  }

  chatContainer.appendChild(chatBox);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}



const imageContainer = document.getElementById('image-container');
const url2 = 'https://api.openai.com/v1/images/generations'
const OPENAI_API_KEY1 = process.env.OPEN_API_KEY1
document.getElementById('send-btn').addEventListener('click', function(){
    const prompt = setupTextarea.value;
    generateImage(prompt);
});

function generateImage(prompt){
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':`Bearer ${OPENAI_API_KEY1}`
        },
        body: JSON.stringify({
            prompt: prompt,
            size: '512x512',
            response_format:'b64_json'
        })
    };

    fetch(url2, requestOptions)
    .then(response => response.json())
    .then(data => {
        const imageData = data.data[0].b64_json;
        imageContainer.innerHTML = `<img src = "data:image/png;base64, ${imageData}">`;
    })
}

