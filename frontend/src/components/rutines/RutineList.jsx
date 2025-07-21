import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../context/AuthProvider';
import RutineCard from './RutineCard';
import { getIdTokenResult } from 'firebase/auth';

const RutineList = () => {
  const { user } = useAuth();
  const [rutines, setRutines] = useState([]);
  const [userRole, setUserRole] = useState('free');

  useEffect(() => {
    if (!user) {
      setUserRole('free');
      return;
    }
    // Se obtienen los claims personalizados
    const fetchClaims = async () => {
       const decodedToken = await getIdTokenResult(user)
        const role = decodedToken.claims.role || 'free';
        setUserRole(role);
    }

    fetchClaims();

  }, [user]);

  useEffect(() => {
    const fetchRutines = async () => {
        const colRef = collection(db, 'workouts_templates');
        const snapshot = await getDocs(colRef);
        const rutineData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('Rutines fetched:', rutineData);
        setRutines(rutineData);
    };

    fetchRutines();
  }, []);

  return (
    <div className="rutine-list">
      {rutines.map(rutine => (
        <RutineCard key={rutine.id} rutine={rutine} userRole={userRole} />
      ))}
    </div>
  );
};

export default RutineList;
