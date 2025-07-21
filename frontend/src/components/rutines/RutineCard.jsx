import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../config/firebase';
import { useAuth } from '../../context/AuthProvider';
import '../../css/index.css'
import { useActiveRutine } from '../../context/ActiveRutineProvider';

const RutineCard = ({ rutine, userRole }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const {activeRutine} = useActiveRutine()

  const isPremium = rutine.membership === 'premium';
  const isAccessible = userRole === 'premium' || !isPremium;


  const handleClick = async () => {
    if (!isAccessible) {
      navigate('/upgrade');
      return;
    }

    if (saving) return;
    setSaving(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { activeRutineId: rutine.rutineId });
      console.error('Rutina actualizada correctamente');
    } catch (err) {
      console.error('Error al actualizar activeRutineId:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`rutine-card 
        ${!isAccessible ? 'locked' : ''} 
        ${isAccessible && activeRutine === rutine.rutineId ? 'active' : ''}`}
    >
      {isPremium && (
        <div className="premium-badge">Premium</div>
      )}

      <h3 className="rutine-title">{rutine.name}</h3>
      <p className="rutine-description">{rutine.description}</p>
      <p className="rutine-days">Días por semana: {rutine.days}</p>

      <div>
        {rutine.sessions.map((session, i) => (
          <span key={i} className="rutine-session">📅 {session.name}</span>
        ))}
      </div>

    </div>
  );
};

export default RutineCard;
