import Fastify from 'fastify';
import {db} from '../../config/database.js'
import { col } from 'sequelize';
const fastify = Fastify({ logger: true });

export const userRoutes = async (fastify) => {
const collectionName = "users"

fastify.put('/', async (req, resp)=>{
  try {
    const snapshot = await db.collection(collectionName).get();
    const users = snapshot.docs.map(doc => ({
      idDoc: doc.id,
      ...doc.data(),
    }));

    resp.send(users);
  }
    catch (err) {
        console.error(err);
        resp.status(404).send({ error: 'Usuario no encontrado' });
    }
});

fastify.get('/', async (req, resp)=>{
  try {
    const { email, role } = req.query
    const colRef = await db.collection(collectionName)
    let query = await colRef.where('email', '==', email.toLowerCase())

    if (role){ query = await colRef.where('role', '==', role.toLowerCase())}
   
    const querySnapshot = await query.get()
    // propiedades de un objeto QuerySnapshot
        //.docs - Un array con los documentos que cumplen la consulta. Cada item tiene .id y .data()
        //.empty
        //.size
        //.forEach() metodo
    
    if (!querySnapshot.empty) {
        return resp.send(querySnapshot.docs[0].data());
    }
    
    return resp.status(404).send({message: "Usuario no encontrado"})

    }
    catch (err) {
        console.error(err);
        return resp.status(500).send({ error: "Error al procesar la solicitud" });
    }
});

fastify.post('/', async(req, resp)=>{
    
    try {
        const { email, displayName, role } = req.body;
        const colRef = db.collection(collectionName)

        const query = colRef.where('email', '==', email.toLowerCase())
        const querySnapshot = await query.get()

        if (!querySnapshot.empty) {
            const existingDoc = querySnapshot.docs[0]
            return resp.status(409).send({message: `El usuario con email: ${existingDoc.data().email} ya existe`})
            
        }
        
        const userData = ({ 
            email: email.toLowerCase(),
            displayName,
            role: role === 'premium' ? 'premium' : 'free',
            createdAt : new Date(),
        })
        const newUser = await colRef.add(userData)
        return resp.status(201).send({message: "usuario creado correctamente", idDoc: newUser.id , user: userData})
    }

    catch (error) {
        console.error(error);
    return resp.status(500).send({ error: "Error al procesar la solicitud" });
  }
})

}

export default userRoutes