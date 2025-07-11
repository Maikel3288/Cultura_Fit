import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin'
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Resolver __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.resolve(__dirname, '..', '..', process.env.FIREBASE_CONFIG);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

//Inicializa la app con las credenciales del servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Obtener instancia de Firestore
export const db = admin.firestore();
export default admin;