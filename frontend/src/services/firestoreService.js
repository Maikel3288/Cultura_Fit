import { db } from '../../../backend/config/database.js'
import { User, Workout, Subscription, CalendarEvent } from '../types/models.js'


const userCollection = db.collection('users')

// Crear documento genérico
// src/services/firestoreService.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";


async function addDocument(collectionName, data) {
  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  }
  catch (error) {
    console.error("Error añadiendo documento: ", error);
    throw error;
  }
}


//Añadir usuario
async function addUser(user) {
  return await addDocument("users", user);
}

