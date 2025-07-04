import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { type ServiceAccount } from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    } as ServiceAccount),
  });
}

const db = getFirestore();
const auth = getAuth();

export async function getUserContext(uid: string) {
  try {
    // 1. Get user metadata
    const userRecord = await auth.getUser(uid);
    const displayName = userRecord.displayName || 'User';

    // 2. Fetch PCOS diagnosis (latest)
    const diagnosisSnap = await db
      .collection(`users/${uid}/diagnosis`)
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    const latestDiagnosis = diagnosisSnap.empty ? null : diagnosisSnap.docs[0].data();

    // 3. Fetch period cycle data from last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const periodsSnap = await db
      .collection(`users/${uid}/periods`)
      .where('timestamp', '>=', sixMonthsAgo)
      .get();

    const periodDates = periodsSnap.docs.map(doc => doc.data().date);

    return {
      displayName,
      latestDiagnosis,
      periodDates,
    };
  } catch (error) {
    console.error('❌ Error fetching user context:', error);
    throw new Error('Failed to retrieve user context');
  }
}
