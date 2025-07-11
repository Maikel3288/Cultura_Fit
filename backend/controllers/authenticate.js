import admin from '../config/database.js'

const authenticate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      res.status(401).send('No token provided');
      return false
    }

    // Verificar token con Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; 
    return true

  } 
  catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send('Unauthorized');
    return false;
  }
}

export default authenticate