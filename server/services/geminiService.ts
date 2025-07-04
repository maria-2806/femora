import { GoogleGenAI } from '@google/genai';
  import dotenv from 'dotenv';

  dotenv.config();

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error('❌ Missing GEMINI_API_KEY in environment variables');
  }

  const genAI = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  export async function getGeminiResponse(prompt: string): Promise<string> {
    try {
      const result = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      });

      if (typeof result.text !== 'string') {
        throw new Error('Gemini API returned an invalid response');
      }

      return result.text; // Text response from Gemini
    } catch (error) {
      console.error('❌ Error calling Gemini API:', error);
      throw new Error('Failed to fetch response from Gemini');
    }
  }