import { db } from "../config/firebase.js";
//Parte	Significado
  // @typedef	Define un tipo personalizado.
  // {import("../...").User}	Importa la interfaz User desde un models.ts.
  // User (al final)	Nombre local del tipo que vas a usar.
/** @typedef {import("../types/models").User} User */
/** @typedef {import("../types/models").Workout} Workout */
/** @typedef {import("../types/models").Session} Session */


  // @param	Indica que es un parámetro de la función.
  // {User}	Tipo del parámetro (User, definido antes con @typedef).
  // user	Nombre del parámetro.
/**
 * Añade un nuevo usuario
 * @param {User} user
 * @returns {Promise<string>} ID del documento creado
 */

const userCollection = db.collection('users')

// Crear documento genérico
// src/services/firestoreService.js
import { collection, addDoc } from "firebase/firestore";



export async function addDocument(collectionName, data) {
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
export async function addUser(user) {
  return await addDocument("users", user);
}

