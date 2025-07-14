import { auth } from 'firebase-admin';
import {db} from '../../config/database.js'
import authenticate from '../../controllers/authenticate.js';
import authenticate from '../controllers/authenticate.js';
import fastify from 'fastify';
import { useAuth } from '../../frontend/src/context/AuthProvider.jsx';

export const workouts = async () => {

fastify.post('/', async (req, reply) =>{
    try {
        const authenticate = await authenticate(req, reply)
        if(!authenticate) return

        const {user} = useAuth()
        const collectionName = 'workouts_completed'
        const collectionRoot = 'users'


        if (!rutineId || !session || !exercices) 
            return reply.status(400).send({ error: 'Faltan campos por cumplimentar' })
        
        const colRef = db.collection(collectionRoot).doc(user.uid).collection(collectionName)
        const docRef = colRef.doc()

        const newWorkout = {
            rutineId,
            session,
            exercices,   // Objeto con ejercicios y sets
            notes,
            durationMin
        } = req.body;

        await docRef.set(newWorkout)
        return reply.send({ message: 'Entrenamiento guardado correctamente', uid: docRef.id, workout: newWorkout  })
        
    }

    
    catch {
        console.error('Error al guardar entrenamiento:', err);
        reply.status(500).send({ error: 'Error interno del servidor' });
    }
})


}

export default workouts