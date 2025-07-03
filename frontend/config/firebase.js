import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };
