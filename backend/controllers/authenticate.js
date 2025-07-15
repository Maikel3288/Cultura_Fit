import admin from '../config/database.js'

const authenticate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      res.status(401).send('Token no proporcionado');
      return false
    }

    // Se verifica el token con Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    // Se extrae la información del usuario
    req.user = decodedToken; 
    return true

  } 
  catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).send('No autorizado');
    return false;
  }
}

export default authenticate