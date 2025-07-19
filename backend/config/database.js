import dotenv from 'dotenv';
dotenv.config();
import admin from 'firebase-admin'
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

// Resolver __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

if (process.env.USE_SECRET_FILE === 'true') {
  // Render: usa el archivo secreto montado
  const serviceAccountPath = '/etc/secrets/firebase-credentials.json';
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
} 
else {
  // Local: usa ruta relativa al proyecto
  const serviceAccountPath = path.resolve(__dirname, '..', '..', process.env.FIREBASE_CONFIG);
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
}

//Inicializa la app con las credenciales del servicio
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Obtener instancia de Firestore
export const db = admin.firestore();
export const auth = admin.auth();

export default admin;