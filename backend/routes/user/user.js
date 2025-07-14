import {db} from '../../config/database.js'
import authenticate from '../../controllers/authenticate.js';

export const userRoutes = async (fastify) => {
const collectionName = "users"

fastify.put('/', async (req, reply)=>{
  try {

    const isAuthenticated = await authenticate(req, reply);
    if (!isAuthenticated) return; 

    const { email} = req.query
    const updateData = req.body;

    if ('email' in updateData) {
      return reply.code(400).send({ error: 'El email no puede ser modificado.' });
    }

    const colRef = db.collection(collectionName)
    let query = colRef.where('email', '==', email.toLowerCase())
    const querySnapshot = await query.get()

    if (snapshot.empty) {
      return reply.code(404).send({ error: 'Usuario no encontrado' });
    }
  
    // Se crea una referencia al documento que se va a actualizar
    const docRef = colRef.doc(querySnapshot.docs[0].id)
    docRef.update(updateData)

    return reply.send({ success: true, message: 'Usuario actualizado correctamente.' });

  }
    catch (err) {
        console.error(err);
        reply.status(500).send({ error: 'Error al actualizar usuario' });
    }
});

fastify.get('/', async (req, reply)=>{
  try {

    const isAuthenticated = await authenticate(req, reply);

    if (!isAuthenticated) return; 

    const { email} = req.query
    const colRef = db.collection(collectionName)
    let query = colRef.where('email', '==', email.toLowerCase())
   
    const querySnapshot = await query.get()
    // propiedades de un objeto QuerySnapshot
        //.docs - Un array con los documentos que cumplen la consulta. Cada item tiene .id y .data()
        //.empty
        //.size
        //.forEach() metodo
    
    if (!querySnapshot.empty) {
        return reply.send(querySnapshot.docs[0].data());
    }
    
    return reply.status(404).send({message: "Usuario no encontrado"})

    }
    catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Error al procesar la solicitud" });
    }
});

fastify.post('/register', async(req, reply)=>{
    
    try {
        const { email, displayName, role } = req.body;
        const colRef = db.collection(collectionName)

        const query = colRef.where('email', '==', email.toLowerCase())
        const querySnapshot = await query.get()

        if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0]
            return reply.status(409).send({message: `El usuario con email: ${existingDoc.data().email} ya existe`})
            
        }
        
        // Se crea una referencia al documento que se va a actualizar
        const newDocRef = colRef.doc()
        const userData = ({ 
            uid: newDocRef.id,         
            email: email.toLowerCase(),
            displayName,
            role: role === 'premium' ? 'premium' : 'free',
            createdAt : new Date(),})

        await newDocRef.set((userData))
        return reply.status(201).send({message: "usuario creado correctamente", idDoc: newDocRef , user: userData})
    }

    catch (error) {
        console.error(error);
    return reply.status(500).send({ error: "Error al procesar la solicitud" });
  }
})


}

export default userRoutes