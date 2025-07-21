import { createContext, useContext, useState, useEffect, use } from 'react';
import { collection, onSnapshot, doc, getDoc, setDoc, where, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js'
import { useAuth } from './AuthProvider.jsx'

const ActiveRutineContext = createContext();
export const useActiveRutine = () =>  useContext(ActiveRutineContext)

export const ActiveRutineProvider = ({ children }) => {

    const [activeRutine, setActiveRutine] = useState(null);
    const [activeRutineName, setActiveRutineName] = useState(null);
    const [loading, setLoading] = useState(true)
    const { user, updateLocalRole } = useAuth();

    useEffect(()=>{
        if(!user) return;
        const userDocRef= doc(db, 'users', user.uid);

        // Se escuchan los cambios en tiempo real en el documento del usuario logueado
        const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setActiveRutine(data.activeRutineId || null);

            const colRef= collection(db, 'workouts_templates');
            const q = query(colRef, where("rutineId", "==", data.activeRutineId))
            const querySnapshot = await getDocs(q);
            
           if (!querySnapshot.empty) {
            const name = querySnapshot.docs[0].data().name || '';
                setActiveRutineName(name);
            } 
            else {
            setActiveRutineName('');
            }
            


        } else {
            setActiveRutine(null);
            setActiveRutineName(null);

        }
        setLoading(false);
        });

        // Limpieza
        return () => unsubscribe();

  }, [user])


    return (
        <ActiveRutineContext.Provider value={{ activeRutine, activeRutineName }}>
            {children}
        </ActiveRutineContext.Provider>

    )
}