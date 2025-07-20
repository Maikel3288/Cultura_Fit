import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import '../../css/index.css'; // para estilos personalizados
import WorkOutCardDetail from './WorkOutCardDetail';

const WorkoutCalendar = ({activeRutine, onStart}) => {
  const [workouts, setWorkouts] = useState([]);
  const [datesWithWorkouts, setDatesWithWorkouts] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user) return;

     // Se recuperan los entrenamientos completados del usuario
      const colRef = collection(db, 'users', user.uid, 'workouts_completed');
      const querySnapShot = query(colRef);
      const snapShot = await getDocs(querySnapShot);

      // Se guardan los entrenamientos en un nuevo array de objetos
      const data = snapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWorkouts(data);

      // Se obtienen las fechas de los entrenamientos para mostrar puntos en el calendario
      const workoutDates = data.map(workout => new Date(workout.createdAt.seconds * 1000).toDateString());
      setDatesWithWorkouts(workoutDates);

    };

    fetchWorkouts();
  }, [user]);

  const handleClick = (value, event) => {
    const selected = workouts.find(workout => {
      const workoutDate = workout.createdAt.toDate().toDateString();
      return workoutDate === value.toDateString();
    });

    if (selected) {
      console.log(selected.id);
      onStart(selected.id)
    }
  };

  // Se muestra un punto en el calendario para cada entrenamiento completado
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const match = workouts.find(workout => {
        const workoutDate = workout.createdAt.toDate().toDateString();
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
