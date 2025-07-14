import axios from 'axios'
import { getIdToken } from 'firebase/auth';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getUserData = async (user) => {

    const idToken = getIdToken(user)
    const userData = await axios.get(`${backendUrl}/api/user`, {
        headers: {
            Authorization: `Bearer ${idToken}`
        }
    })  

    if (!userData) return
    
    return userData.role
}