import {db, auth} from '../config/database.js'
import authenticate from '../controllers/authenticate.js';


export const workouts = async (fastify) => {

fastify.post('/', async (req, reply) =>{
    try {
        const auth = await authenticate(req, reply)

        if (!auth) return reply.code(401).send({ message: `Error en la autorización` });

        const user = auth
        const collectionName = 'workouts_completed'
        const collectionRoot = 'users'

        if (req.body === undefined) return reply.status(400).send({ error: 'Faltan campos por cumplimentar' })

        const { rutineId, session, exercices, notes, durationMin } = req.body

        if (!rutineId || !session || !exercices) 
            return reply.status(400).send({ error: 'Faltan campos por cumplimentar' })
        
        const colRef = db.collection(collectionRoot).doc(user.uid).collection(collectionName)
        const docRef = colRef.doc()
    
        const newWorkout = {
        rutineId,
        session,
        exercices,
        notes,
        durationMin,
        createdAt: new Date()
        }

        await docRef.set(newWorkout)
        return reply.send({ message: 'Entrenamiento guardado correctamente', uid: docRef.id, workout: newWorkout  })
        
    }

    
    catch (err){
        console.error('Error al guardar entrenamiento:', err)
        reply.status(500).send({ error: 'Error interno del servidor' })
    }
})


fastify.get('/', async (req, reply) => {
    try {
        const auth = await authenticate(req, reply)

        if (!auth) return reply.code(401).send({ message: `Error en la autorización` });

        const collectionRoot = 'users'
        const collectionName = 'workouts_completed'

        const queryRef = db
            .collection(collectionRoot)
            .doc(req.user.uid)
            .collection(collectionName)

        const {rutineId} = req.query
        let workoutsSnapshot

        if (rutineId) {
        // Consulta con filtro por rutineId
            workoutsSnapshot = await queryRef.where('rutineId', '==', rutineId)
            .orderBy('createdAt', 'desc')
            .limit(12)
            .get()

        }

        else {
        // Consulta normal sin filtro
            workoutsSnapshot = await queryRef
            .orderBy('createdAt', 'desc')
            .limit(12)
            .get();
        }
            

        const workouts = []
        workoutsSnapshot.forEach(doc => workouts.push({ id: doc.id, ...doc.data() }))

        reply.send({ workouts })
        } 
        catch (err) 
        {
            console.error('Error obteniendo entrenamientos:', err)
            reply.code(500).send({ error: 'Error interno del servidor' })
        }
  });

fastify.get('/:workoutId', async (req, reply) => {
    try {
       const auth = await authenticate(req, reply)

        if (!auth) return reply.code(401).send({ message: `Error en la autorización` });

        const userId = auth.uid
        const collectionName = 'workouts_completed'
        const collectionRoot = 'users'
        const { workoutId } = req.params;

        const docRef = await db
            .collection(collectionRoot)
            .doc(userId)
            .collection(collectionName)
            .doc(workoutId)
            .get();

        if (!docRef.exists) {
            return reply.code(404).send({ error: 'Entrenamiento no encontrado' });
        }

        const workout = { id: docRef.id, ...docRef.data() };
        return reply.send({ workout });
    } 
    catch (err) 
    {
        console.error('Error obteniendo entrenamientos:', err)
        return reply.code(500).send({ error: 'Error interno del servidor' })
    }
});


}



