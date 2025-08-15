// server.js
import dotenv from 'dotenv';
import OpenAI from 'openai';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

let conversationHistory = [{ role: 'system', content: 'You are a helpful assistant.' }];

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

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));