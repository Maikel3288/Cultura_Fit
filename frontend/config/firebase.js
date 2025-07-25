import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDP57oNA8rkadmiFErvl6es2M4ghQwGRBc",
  authDomain: "cultura-fit-4b24a.firebaseapp.com",
  databaseURL: "https://cultura-fit-4b24a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "cultura-fit-4b24a",
  storageBucket: "cultura-fit-4b24a.firebasestorage.app",
  messagingSenderId: "961841078967",
  appId: "1:961841078967:web:b8f2d63e2745c6c1566332",
  measurementId: "G-54Y08W8RLJ"
};

// Inicializar Firebase Client

// initializeApp(firebaseConfig) registra/configura tu aplicación de Firebase usando los datos del proyecto.
const app = initializeApp(firebaseConfig);

// Firestore es la base de datos NoSQL en tiempo real de Firebase.
// getFirestore() (establece la conexion) crea u obtiene un objeto que representa la conexión a la base de datos Firestore de tu proyecto Firebase.
const db = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { db, auth, analytics };
