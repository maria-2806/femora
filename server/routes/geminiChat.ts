import express from 'express';
import { getGeminiResponse } from '../services/geminiService';

const router = express.Router();

// POST /chat
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string.' });
  }

  try {
    const aiResponse = await getGeminiResponse(prompt);
    return res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Gemini route error:', error);
    return res.status(500).json({ error: 'Failed to fetch AI response.' });
  }
});

export default router;
