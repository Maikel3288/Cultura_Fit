import { getAuth, getIdToken } from "firebase/auth";
import { db } from "../firebase";
import { useAuth } from "../src/context/AuthProvider";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createWorkout = async (req, res) =>{
    const auth = getAuth()
    const idToken = getIdToken(auth.currentUser)

    try {
        if (!idToken) 
            return res.status(401).json({ message: "No se pudo autenticar el usuario" });
        
        const newWorkout = await axios.post(`${backendUrl}/workout`, {
            workout: req.body
            }, 
            {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        })

        return newWorkout.data
    } 
    
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear el ejercicio" });
    }

    



}



export const getWorkouts = async (req, res) => {

}

export const deleteWorkout = async (req, res) => {

}