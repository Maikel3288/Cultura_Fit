import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  getDocFromCache,
  addDoc
} from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import '../css/App.css';
import WorkoutCard from '../components/workouts/WorkOutCard';
import WorkOutForm from '../components/workouts/WorkOutForm';
import { useAuth } from '../context/AuthProvider';
import { addUser } from '../routes/firestoreService.js';
import { syncUserClaims } from '../../controllers/user.js';
import { MdOutlineWorkspacePremium } from 'react-icons/md';
import { useActiveRutine } from '../context/ActiveRutineProvider.jsx';
import WorkoutCalendar from '../components/workouts/WorkOutCalendar.jsx';
import WorkOutCardDetail from '../components/workouts/WorkOutCardDetail.jsx';
import RutineList from '../components/rutines/RutineList.jsx';
import {fetchUserLastWorkout } from '../../controllers/date.js'
import { FiArrowDown, FiArrowDownLeft, FiArrowLeftCircle, FiArrowRight, FiArrowUpLeft } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";

export const Home = () => {

  const { user, claims, logout, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [lastWorkout, setLastWorkout] = useState(null);
  const [nextRoutine, setNextRoutine] = useState('');
  const [nextExercises, setNextExercises] = useState([]);
  const [nextRoutineName, setNextRoutineName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [exercisesForForm, setExercisesForForm] = useState([]);
  const {activeRutine, activeRutineName } = useActiveRutine('');
  const [view, setView] = useState('home');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('')

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleUpgrade = () => {
    navigate("/upgrade");
  };

const fetchLastWorkoutAndNext = async () => {
    try {
        // Consulta activeRutineId en Users
        const userCol = collection(db, 'users');
        const q = query(
            userCol, 
            where('email', '==', user.email.toLowerCase())
        );
        const userSnap = await getDocs(q);
        console.log("userSnap", userSnap)

        const userActiveRutine = userSnap.docs[0].data().activeRutineId;
        
        if (!userActiveRutine) {
            console.warn("El usuario no tiene una rutina activa.");
        return;
        }

        // Consulta plantilla rutina activa en Workouts_templates
        const workoutsTCol = collection(db, 'workouts_templates');
        const qu = query(
            workoutsTCol, 
            where("rutineId", "==", userActiveRutine)
        );
        const workoutTemplateSnap = await getDocs(qu);
            
        // 1. Se obtiene el último entrenamiento por fecha
        const userWorkoutsCol = collection(db, 'users', user.uid, 'workouts_completed');
        const qLastWorkout = query(userWorkoutsCol, 
            where("rutineId", "==", userActiveRutine),
            orderBy('createdAt', 'desc'), 
            limit(1));

        const lastWorkoutSnap = await getDocs(qLastWorkout);

        let lastWorkoutData = null;

        if (!lastWorkoutSnap.empty) {
            lastWorkoutData = lastWorkoutSnap.docs[0].data();
        } 
        else {
            // Si no hay entrenamientos previos, se muestra la primera sesión con sus valores por defecto
            
            if (!workoutTemplateSnap) {
                console.warn("No sessions found in the first workout template.");
                return;
            }

            const firstWorkoutData = workoutTemplateSnap.docs[0].data();

            setLastWorkout(firstWorkoutData.sessions[0].exercises);
            setNextRoutine(firstWorkoutData.sessions[0].id);
            setNextRoutineName(firstWorkoutData.sessions[0].name);
            setNextExercises(workoutTemplateSnap.docs[0].data().sessions);
            return

        }

        // 2. Se calcula la siguiente rutina
        const sessions = workoutTemplateSnap.docs[0].data().sessions;
        setNextExercises(sessions)

        const lastWorkoutSessionID = 
            lastWorkoutData && lastWorkoutData.sessionId
            ? lastWorkoutData.sessionId
            : (workoutTemplateSnap.docs[0]?.data()?.sessions?.[0]?.id ?? null);

        const index = sessions.findIndex(session => session.id === lastWorkoutSessionID);
        const nextIndex = (index + 1) % sessions.length;
        const nextSessionId = sessions[nextIndex].id;
        const nextSessionName = sessions[nextIndex].name;
        setNextRoutine(nextSessionId);
        setNextRoutineName(nextSessionName);
        setLastWorkout(lastWorkoutData?.sessions?.[0]?.exercises || []);


        // 3. Se obtiene el último entrenamiento de la siguiente rutina
        const qNextSessionWorkout = query(
            userWorkoutsCol,
            where('rutineId', '==', userActiveRutine),
            where('sessionId', '==', nextSessionId),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        const nextSessionSnap = await getDocs(qNextSessionWorkout);

        if (!nextSessionSnap.empty) {
            const nextWorkoutData = nextSessionSnap.docs[0].data();
            console.log("Recuperado entrenamiento anterior:", nextWorkoutData);
            setExercisesForForm(nextWorkoutData || []);
        } 
        else {
            // Si no hay entrenamientos de la próxima rutina, se muestran los valores por defecto de la plantilla
            console.log("No se encontró entrenamiento previo para esta sesión. Usando plantilla.");
            const nextSession = sessions.find(session => session.id === nextSessionId);
            console.log(nextSession)
            setExercisesForForm(nextSession ? nextSession.exercises : []);

        }
          
    } 
    catch (error) {
        console.error('Error al cargar entrenamientos:', error);
    }
}



  useEffect(() => {
    console.log("useEffect triggered", { user, claims, activeRutine });
    console.log("role", role)
    const runSync = async () => {
      if (user) {
        // Se espera a sincronizar los claims del usuario (el role) para mostrar los elementos adecuados
        await syncUserClaims();

        await fetchLastWorkoutAndNext();

      setLoading(false);
      }
    }

    runSync()
    // Se ejecuta al detectar cambios en el user (login o logout)
  },[user, activeRutine, role]);


  const handleWorkOutDetail = (data) => {
    setSelectedWorkoutId(data)
    setShowForm(true);
  }
  

  // const handleFormSubmit = async (workoutData) => {
  //   if (!user) {
  //     alert('Usuario no autenticado');
  //     return;
  //   }

  //   const workoutToSend = {
  //     ...workoutData
  //   };

  //   try {

  //     const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  //     // Comprueba si ya existe un entrenamiento hoy
  //     const workoutToday = await existingWorkouts()
  //     const alreadyWorkoutToday = workoutToday?.some((w) =>
  //       w.createdAt?.toDate?.().toISOString?.().startsWith(today)
  //     );

  //     if (alreadyWorkoutToday) {
  //       alert("Ya has registrado un entrenamiento hoy.");
  //       return;
  //     }
  //     // Se añade el entrenamiento a la colección de workout_completed del usuario
  //     const userWorkoutsCol = collection(db, 'users', user.uid, 'workouts_completed');
  //     await addDoc(userWorkoutsCol, workoutToSend);
  //     alert('Entrenamiento guardado');

      

  //     setShowForm(false);
  //     setLastWorkout(workoutToSend);

  //     // Recarga los datos para actualizar el estado (NextRutineName) y rerenderizar correctamente el componente WorkOutCard
  //     await fetchLastWorkoutAndNext()

    
  //   } 
  //   catch (error) {
  //     console.error('Error al guardar el entrenamiento:', error);
  //     alert('Ocurrió un error al guardar el entrenamiento.');
  //   }
  // };

  const handleFormSubmit = async (workoutData) => {
      // Se añade el entrenamiento a la colección de workout_completed del usuario
      const userWorkoutsCol = collection(db, 'users', user.uid, 'workouts_completed');
      await addDoc(userWorkoutsCol, workoutData);
      //alert('Entrenamiento guardado');

      

      setShowForm(false);
      setLastWorkout(workoutData);

      // Recarga los datos para actualizar el estado (NextRutineName) y rerenderizar correctamente el componente WorkOutCard
      await fetchLastWorkoutAndNext()
  }
 

  if (loading) return  null 

  return (
    <div className="container">
      {/* Barra superior */}
      <div className="top-bar">
        {role !== "premium" && (
          <button className="btn" onClick={handleUpgrade}>Upgrade <MdOutlineWorkspacePremium size={24}/></button>
        )}
          <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    <div className="home-container">
      {/* Barra lateral */}
      <aside className="sidebar">
        <h2 className="cultura-fit">Cultura Fit</h2>

        <nav className="nav-menu">
          <button className="nav-btn" onClick={() => {setView('home'); setShowForm(false)}}>Inicio</button>
          <button className="nav-btn"onClick={() => {setView('calendar'); setShowForm(false)}}>Calendario</button>
          <div style={{display: 'inline-flex', alignItems: "center"} }>
          <button className={`nav-btn ${!activeRutine ? "active-routine-nav-menu" : ""}`}
            onClick={() => {setView('rutines'); setShowForm(false)}}>Rutinas</button>
          {!activeRutine && (
            <span className="bouncing-arrow"><FaArrowLeftLong style={{ marginTop: '5px', marginLeft: '3px', color: 'orange'}} size={21}/></span>
          )}
          
          </div>
          
        </nav>



        <p className="active-title">Rutina Activa:</p>
        <p className="active-routine"> {activeRutineName ? activeRutineName : ''}</p>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">

        <section>
          <h1>Bienvenido a tu espacio Cultura Fit 💪</h1>
          {!activeRutine && <h3 style={{ color: 'orange', paddingTop: '29px' }} >Seleccione una rutina como activa</h3>}
        </section>
        
       {view === 'home'&& 
        <div style={{ paddingTop: '20px' }}>
          {!showForm ? (
            <WorkoutCard nextRoutine={nextRoutineName} onStart={handleWorkOutDetail} />
          ) : (
            <WorkOutForm 
              exercisesPlaceholder={exercisesForForm} 
              exercisesWorkOutTemplate={nextExercises}
              sessionId={nextRoutine}
              sessionName={nextRoutineName} 
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
              existingWorkouts={fetchUserLastWorkout}
              />
          )}
        </div>
       }  

        {view === 'calendar'&& 
          <div style={{ padding: '20px' }}> 
          {!showForm ? (
            <WorkoutCalendar activeRutine={activeRutine} onStart={handleWorkOutDetail}/>
          ) : (
            <WorkOutCardDetail
              workoutId={selectedWorkoutId} 
              onCancel={() => setShowForm(false)}
            />
          )}
          </div>
        }

        {view === 'rutines'&& 
          <div style={{ padding: '20px' }}>
            <RutineList />
          </div>
        }
      
      </main>
    </div>
    </div>
  );


}
export default Home;



