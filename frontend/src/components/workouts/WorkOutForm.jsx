import React, { useState, useEffect } from 'react';
import { useActiveRutine } from '../../context/ActiveRutineProvider';
import { syncUserClaims } from '../../../controllers/user'

const WorkOutForm = ({
  exercisesPlaceholder = [],
  nextRoutine,
  sessionName,
  exercisesWorkOutTemplate,
  sessionId,
  onSubmit,
  onCancel
}) => {
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const {activeRutine} = useActiveRutine()


  useEffect(() => {
    const hasPlaceholderData = Array.isArray(exercisesPlaceholder) && exercisesPlaceholder.length > 0;

    if (hasPlaceholderData) {
      // Caso 1: ya hay datos guardados de entrenamientos previos, mostrar esos datos
      const formatted = exercisesPlaceholder.map(ex => {
        const setsArray = Array.isArray(ex.sets)
          ? ex.sets.map(set => ({
              reps: set.reps || '',
              rpe: set.rpe || '',
              weight: set.weight || ''
            }))
          : Array.from({ length: 3 }, () => ({ reps: '', rpe: '', weight: '' }));

        return {
          name: ex.name,
          sets: setsArray
        };
      });

      setExercises(formatted);
    } else {
      // Caso 2: no hay entrenamientos previos, usar workout_template de la sesión actual
      const currentSession = exercisesWorkOutTemplate.find(session => session.id === sessionId);

      if (currentSession?.exercises?.length) {
        const formatted = currentSession.exercises.map(ex => {
          const setsArray = Array.from({ length: ex.sets || 3 }, () => ({
            reps: ex.reps || '',
            rpe: ex.rpe || '',
            weight: ex.weight || ''
          }));

          return {
            name: ex.name,
            sets: setsArray
          };
        });

        setExercises(formatted);
      }
    }
  }, [exercisesPlaceholder, exercisesWorkOutTemplate, sessionId]);


 const handleInputChange = (exerciseIndex, setIndex, field, value) => {
  setExercises((prevExercises) => {
    const updatedExercises = [...prevExercises];

    // Cada vez que se actualiza un campo, se crea una copia profunda del ejercicio y sus series
    const updatedExercise = { ...updatedExercises[exerciseIndex] };
    const updatedSets = [...updatedExercise.sets];
    const updatedSet = { ...updatedSets[setIndex] };

    updatedSet[field] = value;
    updatedSets[setIndex] = updatedSet;
    updatedExercise.sets = updatedSets;
    updatedExercises[exerciseIndex] = updatedExercise;

    return updatedExercises;
  });
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('activeRutine:', activeRutine);
    onSubmit({
      exercises: exercises,
      notes,
      durationMin: Number(duration),
      rutineId: activeRutine,
      sessionId: sessionId,
      sessionName: sessionName,
      createdAt: new Date()
    });

  };


  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <h3>Entrenamiento: {sessionName}</h3>

      {exercises.map((exercise, exIndex) => {
        // Se filtra por la sessionId activa en workout_templates
        const currentSession = exercisesWorkOutTemplate.find(
          (session) => session.id === sessionId
        );

        // Se filtra por el ejercicio en workout_templates
        const templateExercise = currentSession?.exercises?.find(
          (ex) => ex.name === exercise.name
        );
        const defaultReps = templateExercise?.reps || '?';
        const defaultRpe = templateExercise?.rpe || '?';

        return (
          <div key={exIndex} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h4>{exercise.name}</h4>

            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} style={{ marginBottom: '8px' }}>
                <strong>Serie {setIndex + 1}</strong>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '5px' }}>
                  <label style={{ flex: 1 }}>{`Reps (${defaultReps})`}</label>
                  <label style={{ flex: 1 }}>{`RPE (${defaultRpe})`}</label>
                  <label style={{ flex: 1 }}>Peso (kg)</label>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  <input
                    type="number"
                    placeholder="Reps"
                    value={set.reps || ''}
                    onChange={(e) =>
                      handleInputChange(exIndex, setIndex, 'reps', e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="RPE"
                    value={set.rpe}
                    onChange={(e) =>
                      handleInputChange(exIndex, setIndex, 'rpe', e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder="(Kg)"
                    value={set.weight}
                    onChange={(e) =>
                      handleInputChange(exIndex, setIndex, 'weight', e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        );
      })}

      <label>
        Notas:
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      </label>

      <label>
        Duración (minutos):
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </label>

      <br/>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button type="submit" className='btn' style={{ marginTop: '10px' }}>
          Guardar Entrenamiento
        </button>
        <button type="button" className='btn' onClick={onCancel} style={{ marginTop: '10px' }}>
          Cancelar
        </button>
      </div>


    </form>
  );
};

export default WorkOutForm;
