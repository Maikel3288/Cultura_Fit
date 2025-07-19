import {auth} from '../config/database.js'

const authenticate = async (req, reply) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    console.log('Token:', token);
    
    if (!token) {
      reply.status(401).send('Token no proporcionado');
      return false
    }

    // Se verifica el token con Firebase Admin SDK
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken

    return decodedToken

  } 
  catch (error) {
    console.error('Error verificando token:', error);
    reply.status(401).send('No autorizado');
    return false;
  }
}

export default authenticate