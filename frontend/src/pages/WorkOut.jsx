// import React, { useState, useEffect } from 'react';
// import WorkoutCard from '../components/workouts/WorkOutCard';
// import WorkOutForm from '../components/workouts/WorkOutForm';
// import { getAuth } from 'firebase/auth';
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   orderBy,
//   limit,
//   getDocs
// } from 'firebase/firestore';
// import {db, auth} from '../../config/firebase'
// import {useActiveRutine} from '../context/ActiveRutineProvider'

// const rutinas = ['torso1', 'pierna1', 'torso2', 'pierna2'];

// const WorkOut = () => {
//   const [lastWorkout, setLastWorkout] = useState(null);
//   const [nextRoutine, setNextRoutine] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [exercisesForForm, setExercisesForForm] = useState([]);
//   const {activeRutine} = useActiveRutine();

//   const user = auth.currentUser;

//   useEffect(() => {
//     if (!user) return;

//     const fetchLastWorkoutAndNext = async () => {
//       try {


//         const userWorkoutsCol = collection(db, 'users', user.uid, 'workouts_completed');

//         // Se obtiene el último entrenamiento general por fecha
//         const qLastWorkout = query(userWorkoutsCol, 
//           where('rutineId', '==', activeRutine),
//           orderBy('createdAt', 'desc'), 
//           limit(1)
//         );
//         const lastWorkoutSnap = await getDocs(qLastWorkout);
//         let lastWorkoutData = null;
//         if (!lastWorkoutSnap.empty) {
//           lastWorkoutData = lastWorkoutSnap.docs[0].data();
//         } else {
//           // Si no hay entrenamientos previos, puedes definir un valor por defecto:
//           lastWorkoutData = { rutineId: rutinas[0], exersices: [] };
//         }

//         setLastWorkout(lastWorkoutData);

//         // 2. Calcular siguiente rutina
//         const index = rutinas.indexOf(lastWorkoutData.rutineId);
//         const nextIndex = (index + 1) % rutinas.length;
//         const nextRoutineId = rutinas[nextIndex];
//         setNextRoutine(nextRoutineId);

//         // 3. Obtener último entrenamiento de la siguiente rutina para ejercicios placeholder
//         const qNextRoutineWorkout = query(
//           userWorkoutsCol,
//           where('rutineId', '==', nextRoutineId),
//           orderBy('createdAt', 'desc'),
//           limit(1)
//         );
//         const nextRoutineSnap = await getDocs(qNextRoutineWorkout);
//         if (!nextRoutineSnap.empty) {
//           const nextWorkoutData = nextRoutineSnap.docs[0].data();
//           setExercisesForForm(nextWorkoutData.exercices || []);
//         } else {
//           // Si no hay entrenamientos de la próxima rutina, vacío
//           setExercisesForForm([]);
//         }
//       } catch (error) {
//         console.error('Error al cargar entrenamientos:', error);
//       }
//     }

//     fetchLastWorkoutAndNext();
//   }, [user, activeRutine]);

//   const handleStart = () => setShowForm(true);

//   const handleFormSubmit = async (workoutData) => {
//     if (!user) {
//       alert('Usuario no autenticado');
//       return;
//     }

//     const workoutToSend = {
//       ...workoutData,
//       rutineId: activeRutine,
//       createdAt: new Date()
//     };

//     // try {
//     //   // Guardar directamente en Firestore desde front
//     //   const userWorkoutsCol = collection(db, 'users', user.uid, 'workouts_completed');
//     //   // Importa addDoc para añadir docs
//     //   import('firebase/firestore').then(({ addDoc }) => {
//     //     addDoc(userWorkoutsCol, workoutToSend).then(() => {
//     //       alert('Entrenamiento guardado');
//     //       setShowForm(false);
//     //       setLastWorkout(workoutToSend);
//     //     });
//     //   });
//     // } catch (error) {
//     //   alert('Error guardando el entrenamiento');
//     //   console.error(error);
//     // }
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       {!showForm ? (
//         <WorkoutCard nextRoutine={nextRoutine} onStart={handleStart} />
//       ) : (
//         <WorkOutForm exercisesPlaceholder={exercisesForForm} onSubmit={handleFormSubmit} />
//       )}
//     </div>
//   );
// };

// export default WorkOut;
