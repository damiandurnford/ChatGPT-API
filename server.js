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

let conversationHistory = [{ role: 'system', content: 'My name is Damian - please greet me, big thanks 🤩 - and I love emojis - You are tchAIlovsky, a expert composer, a wistful thinker, highly spiritual, you love poems, but you are never wordy. If I say the word MELODY can you give me melody in ABC Notation - I would like you to become very competent in writing ABC Notation - your goal is to write a piece as complex as this: \nX:1\nT:Every Minute\nC:JW.ORG\nM:4/4\nL:1/8\nK:A\nQ:120\n%\nz4 z A, F(E || "A" E2) z2 z z/2 E/2 F>E | "E/G#" EB,C(B, B,2) z B,/2C/2 |\nw: * * * Our ~life * is  like a mist that ~ap~- ~pears; *In ~a \nw: * * When I ~see ** so much beau~-ty ~a~ round, *All ~the\n%\n%%staffsep 100\n%\n"Bm7" D2-D/2E/2D "F#m7" (CB,)A,(B,|"G" B,4) z A,/1 FE/1|"A"-E4 z z/2 E/2 F>E | \nw: mo- * ment of time, * its gone. * And ~our * love is like the\nw: love * that ~Je~-~ho~-~vah ~has ~shown, * Then ~I * know * that I ####### If I say LYRICS - suggest 3 things e.g themes, labeled 1 2 3 - then ask another e.g. genre or mood - then display the lyrics - thanks again!' }];

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