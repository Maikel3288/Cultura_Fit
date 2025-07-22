import React, { useEffect } from 'react';


const WorkoutCard = ({ nextRoutine, onStart }) => {

  useEffect(() => {
    console.log('nextRoutine:', nextRoutine);
  }, [nextRoutine]);

  return (
    <div className="workout-card" style={{ border: '1px solid #ddd',padding: '20px', borderRadius: '8px', maxWidth: '400px' }}>
      <h3>Siguiente rutina: {nextRoutine}</h3>
      <button onClick={onStart} className= "btn" style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>
        Iniciar Entrenamiento
      </button>
    </div>
  );
};

export default WorkoutCard;
