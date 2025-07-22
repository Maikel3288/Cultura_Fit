import React, { use, useEffect, useState } from 'react';
import { doc, getDoc, getDocs, updateDoc, collection, query, where } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../context/AuthProvider';

const WorkOutCardDetail = ({ workoutId, onCancel }) => {
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultExerciceData, setDefaultExerciceData] = useState([]);
  const [workoutTemplate, setWorkoutTemplate] = useState('')
  const [sessionTemplate, setSessionTemplate] = useState('')

  // Carga el entrenamiento y guarda en formData los datos para editar
  useEffect(() => {
    const fetchWorkout = async () => {
        if (!user || !workoutId) return;

            const docRef = doc(db, 'users', user.uid, 'workouts_completed', workoutId);
            const snapShot = await getDoc(docRef);

        if (snapShot.exists()) {
            const data = snapShot.data();
            const {sessionId, rutineId} = data
            
            setWorkout({ id: snapShot.id, ...data });

            // Se muestran los datos para editar
            const editableExercises = data.exercises.map((exercise) => ({
            name: exercise.name,
            sets: exercise.sets?.map((set) => ({
                reps: set.reps || '',
                weight: set.weight || '',
                rpe: set.rpe || ''
            }))
            }));

            setFormData(editableExercises);

            
            // Se obtienen los datos por defecto de las sesiones (principalmente reps y rpe para mostrar en el formulario en los label)

            const colRef = collection(db, 'workouts_templates');
            const q = query(colRef, 
                where('rutineId', "==", rutineId)
            )
            const querySnapshot = await getDocs(q);


            if (!querySnapshot.empty) {
                const docData = querySnapshot.docs[0].data();
                const sessions = docData.sessions || [];
                setWorkoutTemplate(docData)

                const sessionDefaultData = sessions.find(session => session.id === sessionId);
                setSessionTemplate(sessionDefaultData)
                
                const defExData = sessionDefaultData ? sessionDefaultData.exercises : [];
                
                setDefaultExerciceData(defExData);

            }
        }

      setLoading(false);
    
    
    };

    fetchWorkout();
  }, [user, workoutId]);

  // Manejar los cambios de los inputs del formulario (se hace una copia profunda del array)
  const handleInputChange = (exerciseIndex, setIndex, field, value) => {
    const updatedData = [...formData];
    updatedData[exerciseIndex].sets[setIndex][field] = value;
    setFormData(updatedData);
  };

  // Guardar los cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'users', user.uid, 'workouts_completed', workoutId);
      await updateDoc(docRef, {
        exercises: formData
      });
      alert('Entrenamiento actualizado');
      onCancel();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert('Error al guardar los cambios.');
    }
  };

  if (loading) return <p>Cargando entrenamiento...</p>;
  if (!workout) return <p>Entrenamiento no encontrado.</p>;

  const dateReversed = workout.regDate.split('-').reverse().join('-');

  return (
    <div className="workout-detail">
      <h3 style={{marginBottom: '20px'}}>
        <span style={{color: '#0a5953'}}>{`${workoutTemplate.name}: `}</span>
        <span style={{color: '#0a5953'}}>{`"${sessionTemplate.name}" del ${dateReversed}`}</span>
        </h3>
      
      <form onSubmit={handleSubmit}>
        {formData.map((exercise, index) => (
        
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4>{exercise.name}</h4>

            {exercise.sets?.map((set, setIndex) => (
              <div key={setIndex} style={{ marginBottom: '10px' }}>
                <label>Serie {setIndex + 1}</label>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '5px' }}>
                  <label style={{ flex: 1 }}>{`Reps (${defaultExerciceData[index].reps})`}</label>
                  <label style={{ flex: 1 }}>{`RPE (${defaultExerciceData[index].rpe})`}</label>
                  <label style={{ flex: 1 }}>Peso (kg)</label>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    placeholder="Reps"
                    value={set.reps}
                    onChange={(e) => handleInputChange(index, setIndex, 'reps', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="RPE"
                    value={set.rpe}
                    onChange={(e) => handleInputChange(index, setIndex, 'rpe', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Kgs"
                    value={set.weight}
                    onChange={(e) => handleInputChange(index, setIndex, 'weight', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button type="submit" className="btn">Guardar Cambios</button>
          <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default WorkOutCardDetail;
