import React, { useState, useEffect } from 'react';
import { useActiveRutine } from '../../context/ActiveRutineProvider';
import { syncUserClaims } from '../../../controllers/user'
import Calendar from 'react-calendar';

const WorkOutForm = ({
  exercisesPlaceholder = [],
  nextRoutine,
  sessionName,
  exercisesWorkOutTemplate,
  sessionId,
  onSubmit,
  onCancel,
  existingWorkouts
}) => {
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState('');
  const {activeRutine} = useActiveRutine()


  useEffect(() => {
    // console.log("ExercisesPlaceholder", exercisesPlaceholder)

    if (Array.isArray(exercisesPlaceholder.exercises)) {
      // Si existen entrenamientos previos guardados con la sesión actual, se muestra la ultima sesión

      const formatted = exercisesPlaceholder.exercises.map(ex => {
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
      // Si no hay entrenamientos previos, usar workout_template de la sesión
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

  // Se obtiene la fecha de hoy
  const getToday = () => {
    return new Date().toLocaleDateString('sv-SE'); // "YYYY-MM-DD"
    // const [year, month, day] = today.split('-');
    // return `${day}-${month}-${year}`; // "DD-MM-YYYY"
  };

const [fecha, setFecha] = useState(getToday());
const [fechaError, setFechaError] = useState(false);


const handleOnSubmit = async (e) => {
  e.preventDefault();

  try {
    const workoutToday = await existingWorkouts(fecha);
    //console.log("workoutToday", workoutToday)
    const calendarDate = workoutToday?.some((w) =>
      w.regDate === fecha
    );

    // console.log("fecha", fecha)
    // console.log("Date", calendarDate)
    // console.log("fechaError", fechaError)
    if (calendarDate) {
      setFechaError(true)
      // alert("Ya has registrado un entrenamiento en esa fecha.")
      // console.log("Ya has registrado un entrenamiento en esa fecha.");
      return;
    }

    setFechaError(false)

    // Enviar datos al padre
    onSubmit({
      exercises,
      notes,
      durationMin: Number(duration),
      rutineId: activeRutine,
      sessionId,
      sessionName,
      createdAt: new Date(),
      regDate: fecha
    });

    //alert('Datos enviados correctamente al padre');
  } 
  catch (error) {
    console.error('Error al guardar el entrenamiento:', error);
    alert('Ocurrió un error al guardar el entrenamiento.');
  }
};




  return (
    <form onSubmit={handleOnSubmit} style={{ marginTop: '20px' }}>
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
        />
      </label>

      <label>
        Fecha del entrenamiento:
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className={fechaError ? 'fecha-error' : 'fecha'}
        />
          {fechaError && (<span className="message-error">Ya has registrado un entrenamiento en esa fecha.</span>)}
        
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
