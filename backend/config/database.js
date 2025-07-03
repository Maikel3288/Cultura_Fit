import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin'

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
