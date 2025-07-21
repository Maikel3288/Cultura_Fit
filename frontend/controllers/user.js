import axios from 'axios'
import { getIdToken, getAuth, getIdTokenResult } from 'firebase/auth';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getUserData = async (user) => {

    const idToken = await getIdToken(user)
    const userData = await axios.get(`${backendUrl}/api/users`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    })  

    if (!userData) return
    
    return userData.role
}

export const updateUserData = async (user, role) => {
    const idToken = await getIdToken(user)

    const userData = await axios.put(`${backendUrl}/api/users`, {
        role: role
    }, {
        headers: {
            Authorization: `Bearer ${idToken}`
        },
        params: {
            email: user.email 
        }
    })  
    console.log(userData.data)
    if (!userData) return

    return true
}

export const syncUserClaims = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const idToken = await getIdToken(user)

  if (!user) return;
  // Se llama al backend para sincronizar de nuevo el usuario y sus claims
    await axios.post(`${backendUrl}/api/users/sync-user/${user.uid}`, 
        {},
        {
            headers: {
                Authorization: `Bearer ${idToken}`
            }
        }
);


  // Se refresca el token para recibir el nuevo claim con el rol actualizado a Premium
  await user.getIdToken(true);

  // Se guarda el token actualizado en localStorage
  const newToken = await user.getIdToken();
  localStorage.setItem("token", newToken);

  const decodedToken = await getIdTokenResult(user, true);

  return decodedToken
};
