import { createContext, useContext, useState, useEffect, use } from 'react';
import { collection, onSnapshot, doc, getDoc, setDoc, where, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase.js'
import { useAuth } from './AuthProvider.jsx'

const ActiveRutineContext = createContext();
export const useActiveRutine = () =>  useContext(ActiveRutineContext)

export const ActiveRutineProvider = ({ children }) => {

    const [activeRutine, setActiveRutine] = useState(null);
    const [loading, setLoading] = useState(true)
    const { user } = useAuth();

    useEffect(()=>{
        if(!user) return;
        const userDocRef= doc(db, 'users', user.uid);

        // Se escuchan los cambios en tiempo real en el documento del usuario logueado
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setActiveRutine(data.activeRutineId || null);
        } else {
            setActiveRutine(null);

        }
        setLoading(false);
        });

        // Limpieza
        return () => unsubscribe();

  }, [user]);


    return (
        <ActiveRutineContext.Provider value={{ activeRutine }}>
            {children}
        </ActiveRutineContext.Provider>

    )
}