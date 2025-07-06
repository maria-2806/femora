import express from 'express';
import { getGeminiResponse } from '../services/geminiService';
import { verifyFirebaseToken, AuthenticatedRequest } from '../middleware/verifyFirebaseToken';

const router = express.Router();


// POST /chat with authentication
router.post('/', verifyFirebaseToken, async (req: AuthenticatedRequest, res) => {
  const { prompt } = req.body;
  const uid = req.uid;
  console.log('📩 Chat POST received. Prompt:', prompt, 'UID:', uid);

if (!prompt || typeof prompt !== 'string') {
  return res.status(400).json({ error: 'Prompt is required and must be a string.' });
}

if (!uid) {
  return res.status(401).json({ error: 'Unauthorized: No user ID found' });
}

try {
  const aiResponse = await getGeminiResponse(prompt, uid); // ✅ safe now!
  console.log('✅ Chat route hit');
  return res.status(200).json({ response: aiResponse });
  
} catch (error) {
  console.error('Gemini route error:', error);
  return res.status(500).json({ error: 'Failed to fetch AI response.' });
}

});

export default router;
