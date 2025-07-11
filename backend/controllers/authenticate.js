import admin from '../config/database.js'

async function authenticate(req, res) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).send('No token provided');
    }

    // Verificar token con Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    return req.user = decodedToken; 

  } 
  catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send('Unauthorized');
  }
}

export default authenticate