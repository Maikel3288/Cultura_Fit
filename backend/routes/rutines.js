import {db, auth} from '../config/database.js'
import authenticate from '../controllers/authenticate.js';

export const rutines = async (fastify) => {

fastify.get('/', async (req, reply) => {
  try {
    const auth = await authenticate(req, reply);
    if (!auth) return reply.code(401).send({ error: 'Error en la autorización' });

    const user = auth;
    const role = user.role || user.claims?.role || 'free'; // 'free' o 'premium'

    const rutinesRef = db.collection('workouts_templates');
    let queryRef = rutinesRef

    if (role === 'free') {
      queryRef = rutinesRef.where('membership', '==', 'free');
    }

    const snapshot = await queryRef.get();

    const rutines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reply.send({ rutines });

  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: 'Error al obtener rutinas' });
  }
});

}

