import { GoogleGenAI } from '@google/genai';
import { adminAuth } from '../firebaseAdmin'; // make sure adminAuth is exported
import dotenv from 'dotenv';
import { db } from '../firebaseAdmin';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) throw new Error('❌ Missing GEMINI_API_KEY');

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Groups period dates into distinct cycles.
 */
function groupPeriodDatesByCycle(dates: Date[]): Date[][] {
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const cycles: Date[][] = [];

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    const lastCycle = cycles[cycles.length - 1];

    if (!lastCycle || (current.getTime() - lastCycle[lastCycle.length - 1].getTime()) > 24 * 60 * 60 * 1000) {
      // New cycle if gap > 1 day
      cycles.push([current]);
    } else {
      lastCycle.push(current);
    }
  }

  return cycles;
}

/**
 * Fetches personalized user context from Firestore.
 */

async function getUserContext(uid: string): Promise<string> {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [diagnosisSnap, periodsSnap, userRecord] = await Promise.all([
      db.collection('users').doc(uid).collection('diagnosis')
        .orderBy('timestamp', 'desc').limit(1).get(),
      db.collection('users').doc(uid).collection('periods')
        .where('date', '>=', sixMonthsAgo).orderBy('date', 'desc').get(),
      adminAuth.getUser(uid), // 🔥 get name/email from Firebase Auth
    ]);

    const diagnosis = diagnosisSnap.docs[0]?.data();

    const rawPeriodDates: Date[] = periodsSnap.docs.map(doc => {
      const d = doc.data().date;
      return d.toDate ? d.toDate() : new Date(d);
    });

    const groupedCycles = groupPeriodDatesByCycle(rawPeriodDates);

    const formattedCycles = groupedCycles.map((cycle, index) => {
      const dates = cycle.map(d => d.toDateString()).join(', ');
      return `Cycle ${index + 1}: ${dates}`;
    });

    return `
👤 **User Profile**
- Name: ${userRecord.displayName || 'N/A'}
- Email: ${userRecord.email || 'N/A'}

🩺 **Latest PCOS Diagnosis**
- Probability: ${diagnosis?.probability ?? 'Not available'}
- Notes: ${diagnosis?.notes ?? 'None'}

📆 **Period Activity (last 6 months)**
These are the recorded *active bleeding days* grouped by menstrual cycles:
${formattedCycles.length > 0 ? formattedCycles.join('\n') : 'No period data available'}

📘 Use this context to provide an informative and compassionate response.
    `.trim();
  } catch (err) {
    console.warn('⚠️ Failed to load user context for UID:', uid, err);
    return '⚠️ Context unavailable. Reply based only on prompt.';
  }
}


/**
 * Calls Gemini API with injected context and prompt.
 */
async function getGeminiResponse(prompt: string, uid: string): Promise<string> {
  try {
    console.log('🎯 Inside Gemini service. UID:', uid, 'Prompt:', prompt);

    const context = await getUserContext(uid);

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `
You are Femora, an empathetic AI health assistant that supports users with PCOS and menstrual health.
You do not need to use this context in every response unless asked about it, but it should inform your understanding of the user.
Here is the user context:
-------------------------------
${context}
-------------------------------


Now respond to the user's message:
"${prompt}"
`.trim(),
            },
          ],
        },
      ],
    });

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!responseText) {
      console.warn('⚠️ Empty response from Gemini API');
      return 'Sorry, I couldn’t generate a response right now.';
    }

    return responseText;
  } catch (error) {
    console.error('❌ Gemini API Error:', error);
    throw new Error('Gemini response failed');
  }
}

export { getGeminiResponse };
