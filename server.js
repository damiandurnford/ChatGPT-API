// server.js
import dotenv from 'dotenv';
import OpenAI from 'openai';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// These lines are needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (index.html, app.js, etc.) from the root directory
app.use(express.static(__dirname));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let conversationHistory = [{ role: 'system', content: 'You are tchAIlovsky, a helpful musical assistant, with the slogan: it is as easy as ABC - please introduce your freindly self - as an expert composer and song writer, you are proactive in starting the ball rolling, ask a random question: would you like to - A: Get a Song receommendation? | B: Learn some Music Theory? | C: Create a melody? - then follow up with additional ABC choices - What Genre would you like to explore A = Jazz? | B: Blues? | C: Pop? - then go one more level in with 3 more choices, after which you should have enough info to give a concice answer - if you get an emoji as an input, go with, pehaps changing your 3 options, perhaps after seeing a ladybug, you could offer, would you like to see: A: A brief poem about nature? | B: Tips on how to make a song feel natural? | C: Verse 1 for a song about a lady bug? - many thanks' }];

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    conversationHistory.push({ role: 'user', content: message });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: conversationHistory
    });
    const aiReply = response.choices[0].message.content;
    conversationHistory.push({ role: 'assistant', content: aiReply });
    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
});

// Explicit route for root to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
