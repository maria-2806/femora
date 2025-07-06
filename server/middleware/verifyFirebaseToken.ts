import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../firebaseAdmin';

export interface AuthenticatedRequest extends Request {
  uid?: string;
}

export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    console.log('🔐 Incoming request to protected route');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    console.log('🔓 Token verified for UID:', decodedToken.uid);

    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
