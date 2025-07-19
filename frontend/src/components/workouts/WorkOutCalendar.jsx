import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import '../../css/index.css'; // para estilos personalizados

const WorkoutCalendar = ({activeRutine, onUpdate}) => {
  const [workouts, setWorkouts] = useState([]);
  const [datesWithWorkouts, setDatesWithWorkouts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;

      const col = collection(db, 'users', user.uid, 'workouts_completed');
      const q = query(col);
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setWorkouts(data);

      const workoutDates = data.map(w =>
        new Date(w.createdAt.seconds * 1000).toDateString()
      );

      setDatesWithWorkouts(workoutDates);
    };

    fetchWorkouts();
  }, [user]);

  const handleClick = (value, event) => {
    const selected = workouts.find(w => {
      const workoutDate = new Date(w.createdAt.seconds * 1000).toDateString();
      return workoutDate === value.toDateString();
    });

    if (selected) {
      navigate(`/workout/${selected.id}`);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const match = workouts.find(w => {
        const workoutDate = new Date(w.createdAt.seconds * 1000).toDateString();
        return workoutDate === date.toDateString();
      });

      if (match) {
        return (
          <div className="dot" title={match.sessionId || 'Entrenamiento'}>
            ●
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <h2>Calendario de entrenamientos</h2>
      <Calendar
        onClickDay={handleClick}
        tileContent={tileContent}
        locale="es-ES"
      />
    </div>
  );
};

export default WorkoutCalendar;
