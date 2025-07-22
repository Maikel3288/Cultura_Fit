import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase.js'


export const isSameDay = (date) => {
  const workoutDate = new Date (date)
  const today = new Date();

  return (
    workoutDate.getFullYear() === today.getFullYear() &&
    workoutDate.getMonth() === today.getMonth() &&
    workoutDate.getDate() === today.getDate()
  );
};

export const fetchUserLastWorkout = async (fecha) => {
  const colRef = collection(db, 'users', auth.currentUser.uid, 'workouts_completed');
  const qLastWorkout = query(colRef, where('regDate', "==", fecha));
  const lastWorkoutSnap = await getDocs(qLastWorkout);

  if (!lastWorkoutSnap.empty) {
    const lastWorkout = lastWorkoutSnap.docs[0].data();
    let regDate = lastWorkout.regDate;

    if (regDate && isSameDay(regDate)) {
      console.log('Ya existe un entrenamiento guardado hoy');
      return [lastWorkout];
    }

    return [lastWorkout]; // Existe uno que no es de hoy
  }

  return []; // No hay ningún entrenamiento
};


