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

        const { rutineId, sessionId, exercises, notes, durationMin, regDate } = req.body

        if (!rutineId || !sessionId || !exercises) 
            return reply.status(400).send({ error: 'Faltan campos por cumplimentar' })
        
        const colRef = db.collection(collectionRoot).doc(user.uid).collection(collectionName)
        const docRef = colRef.doc()
    
        const newWorkout = {
        rutineId,
        sessionId,
        exercises,
        notes,
        durationMin,
        regDate,
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

        const {rutineId, sessionId} = req.query
        let workoutsSnapshot

        if (rutineId) {
        // Consulta con filtro por rutineId
            workoutsSnapshot = await queryRef
            .where('rutineId', '==', rutineId)
            .where('sessionId', '==', sessionId)
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

fastify.patch('/:workoutId', async (req, reply) => {
    try {
        const auth = await authenticate(req, reply);
        if (!auth) return reply.code(401).send({ message: 'Error en la autorización' });

        const userId = auth.uid;
        const { workoutId } = req.params;
        const {
            exercices,
            notes,
            durationMin,
            regDate
        } = req.body;

        // Validar que regDate esté definido
        if (regDate === undefined) {
        return reply.status(400).send({ error: 'El campo regDate (yyyy-mm-dd) es oblitaroio' });
        }


        const collectionRoot = 'users';
        const collectionName = 'workouts_completed';
        const docRef = db.collection(collectionRoot).doc(userId).collection(collectionName).doc(workoutId);

        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return reply.code(404).send({ error: 'Entrenamiento no encontrado' });
        }

        const existingWorkout = docSnap.data();

        // Se valida si regDate cambió
        if (existingWorkout.regDate !== regDate) {
            // Buscar si ya existe otro entrenamiento con esa regDate
            const colRef = db.collection(collectionRoot).doc(userId).collection(collectionName);
            const sameDateSnap = await colRef.where('regDate', '==', regDate).get();

            if (!sameDateSnap.empty) {
                return reply.code(409).send({ error: 'Ya existe un entrenamiento registrado en esa fecha' });
            }
        }

        // Preparar la data actualizada
        const updatedWorkout = {
            updatedAt: new Date()
        };

        if (exercices !== undefined) updatedWorkout.exercices = exercices;
        if (notes !== undefined) updatedWorkout.notes = notes;
        if (durationMin !== undefined) updatedWorkout.durationMin = durationMin;
        if (regDate !== undefined) updatedWorkout.regDate = regDate;

        await docRef.update(updatedWorkout);
        return reply.send({ message: 'Entrenamiento actualizado correctamente', workout: updatedWorkout });

    } catch (err) {
        console.error('Error actualizando entrenamiento:', err);
        console.error('Mensaje:', err.message);
        console.error(err.stack);
        reply.status(500).send({ error: 'Error interno del servidor' });
    }
});



}



