import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken
} from "firebase/auth";
import { collection, doc, getDoc, setDoc, where, query, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebase.js'

const AuthContext = createContext();
export const useAuth = () =>  useContext(AuthContext)



export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const collectionName = "users"
    const [token, setToken] = useState()

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const idToken = await getIdToken(userCredential.user)
        setUser(userCredential.user)
        setToken(idToken)

        localStorage.setItem("token", idToken);

        return userCredential
    }


    const register = async ({email, password, displayName}) => {
        const colRef = collection(db, collectionName)
        const q = query(colRef, where('email', '==', email.toLowerCase()))
        const querySnapShot = await getDocs(q)

        
        try {
            if (querySnapShot.empty){
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            
            //doc devuelve la referencia al documento, luego escribimos/creamos el doc con los datos del usuario
            const docRef = await setDoc(doc(db, collectionName, userCredential.user.uid), {
                uid: userCredential.user.uid,
                email: email,
                password: password,
                displayName: displayName,
                role: "free",
                createdAt: new Date()
            })
            console.log(token)
            const idToken = await userCredential.user.getIdToken()
            setUser (userCredential.user)
            setToken(idToken)

            localStorage.setItem("token", idToken);

            return userCredential
            }
        }

        catch (e) {
            console.error("Firebase error:", e);
            throw new Error (`Error: ${e.message}`)
        }
    }

    const logout = () => {
        signOut(auth)
    }

    useEffect(()=>{
        // onAuthStateChanged es un observable que emite eventos, el callback se ejecuta cuando hay cambios en el observable
        // Se guarda la función para cancelar la suscripción
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser)=>{
            setUser(firebaseUser)
            setLoading(false)

            if (!firebaseUser) {
                setToken(null);
                return
            }
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
    
        })

        //Se llama a la funcion de cancelación
        return () => {
            unsubscribe()
        }
    }, [])

    return (
        // Se proporciona el contexto a los componentes hijos
        <AuthContext.Provider value = {{user, login, logout, register, loading}}>
            {!loading && children}
        </AuthContext.Provider> )
}

 


