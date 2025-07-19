import {db} from '../config/database.js'

// Plantillas de rutinas
const rutinas = [
  {
    name: "Full Body Básico",
    rutineId: "fb_1_3d_inciate",
    type: "fullbody",
    level: "iniciate",
    days: "3",
    sessions: [
      {
        name: "Día 1 - FullBody A",
        id: "fullbodyA",
        exercises: [
          { name: "Sentadillas", sets: 4, reps: "10", rpe: 8 },
          { name: "Press Banca", sets: 4, reps: "8", rpe: 8 },
          { name: "Remo con Barra", sets: 3, reps: "10", rpe: 8 },
          { name: "Curl Bíceps", sets: 3, reps: "12", rpe: 9 }
        ]
      },
      {
        name: "Día 2 - FullBody B",
        id: "fullbodyB",
        exercises: [
          { name: "Peso Muerto", sets: 4, reps: "6", rpe: 8 },
          { name: "Dominadas", sets: 3, reps: "8", rpe: 9 },
          { name: "Press Militar", sets: 3, reps: "10", rpe: 8 },
          { name: "Abdominales", sets: 3, reps: "15", rpe: 7 }
        ]
      },
      {
        name: "Día 3 - FullBody C",
        id: "fullbodyC",
        exercises: [
          { name: "Zancadas", sets: 4, reps: "12", rpe: 8 },
          { name: "Fondos en paralelas", sets: 3, reps: "10", rpe: 8 },
          { name: "Remo con Mancuerna", sets: 3, reps: "10", rpe: 8 },
          { name: "Plancha", sets: 3, reps: "60 seg", rpe: 7 }
        ]
      }
    ]
  },
  {
    name: "Torso/Pierna Intermedio",
    rutineId: "tl_1_4d_inciate",
    type: "torso_leg",
    level: "iniciate",
    days: "4",
    sessions: [
      {
        name: "Torso 1",
        id: "torso1",
        exercises: [
          { name: "Press Banca", sets: 4, reps: "8", rpe: 8.5 },
          { name: "Dominadas", sets: 4, reps: "8", rpe: 9 },
          { name: "Press Militar", sets: 3, reps: "10", rpe: 8 },
          { name: "Remo con Barra", sets: 3, reps: "10", rpe: 8.5 }
        ]
      },
      {
        name: "Pierna 1",
        id: "leg1",
        exercises: [
          { name: "Sentadillas", sets: 4, reps: "10", rpe: 8 },
          { name: "Peso Muerto Rumano", sets: 3, reps: "10", rpe: 8 },
          { name: "Zancadas", sets: 3, reps: "12", rpe: 8 },
          { name: "Elevación de gemelos", sets: 4, reps: "15", rpe: 7.5 }
        ]
      },
      {
        name: "Torso 2",
        id: "torso2",
        exercises: [
          { name: "Press Inclinado", sets: 4, reps: "8", rpe: 8.5 },
          { name: "Remo con Mancuerna", sets: 3, reps: "10", rpe: 8 },
          { name: "Fondos", sets: 3, reps: "10", rpe: 9 },
          { name: "Elevaciones laterales", sets: 3, reps: "12", rpe: 8 }
        ]
      },
      {
        name: "Pierna 2",
        id: "leg2",
        exercises: [
          { name: "Prensa", sets: 4, reps: "12", rpe: 8 },
          { name: "Curl Femoral", sets: 3, reps: "12", rpe: 8.5 },
          { name: "Extensión de Cuádriceps", sets: 3, reps: "15", rpe: 8 },
          { name: "Abductores", sets: 3, reps: "15", rpe: 8 }
        ]
      }
    ]
  },
  {
    name: "Torso/Pierna + Brazo",
    rutineId: "tla_1_5d_intermidiate",
    type: "torso_legs_arm",
    level: "intermidiate",
    days: "5",
    sessions: [
      {
        name: "Torso A",
        id: "torsoA",
        exercises: [
          { name: "Jalón con barra en polea alta", sets: 3, reps: "8", rpe: 7 },
          { name: "Remo gironda", sets: 3, reps: "10", rpe: 8 },
          { name: "Pull over en polea", sets: 3, reps: "14", rpe: 8 },
          { name: "Press banca plano", sets: 3, reps: "8", rpe: 7 },
          { name: "Press banca inclinado", sets: 3, reps: "8", rpe: 8 }
        ]
      },
      {
        name: "Pierna A",
        id: "legA",
        exercises: [
          { name: "Sentadilla libre", sets: 3, reps: "8", rpe: 7 },
          { name: "Zancadas", sets: 3, reps: "12", rpe: 8 },
          { name: "Curl femoral sentado", sets: 3, reps: "12", rpe: 8 },
          { name: "Abducion en maquina", sets: 3, reps: "14", rpe: 9 },
          { name: "Crunch abdominal", sets: 4, reps: "12", rpe: 8 }
        ]
      },
      {
        name: "Brazo",
        id: "arm",
        exercises: [
          { name: "Press Militar", sets: 3, reps: "8", rpe: 8 },
          { name: "Elevaciones laterales en polea", sets: 3, reps: "8", rpe: 8 },
          { name: "Curl bíceps con barra", sets: 3, reps: "12", rpe: 9 },
          { name: "Curl martillo", sets: 3, reps: "12", rpe: 8 },
          { name: "Extensión tríceps", sets: 3, reps: "12", rpe: 9 },
          { name: "Fondos en banco", sets: 3, reps: "10", rpe: 8 }
        ]
      },
      {
        name: "Torso B",
        id: "torsoB",
        exercises: [
          { name: "Press inclinado", sets: 4, reps: "8", rpe: 8.5 },
          { name: "Remo con mancuerna", sets: 3, reps: "10", rpe: 8 },
          { name: "Elevaciones frontales", sets: 3, reps: "12", rpe: 8 },
          { name: "Facepull en polea", sets: 3, reps: "15", rpe: 7 }
        ]
      },
      {
        name: "Pierna B",
        id: "legB",
        exercises: [
          { name: "Prensa", sets: 3, reps: "12", rpe: 8 },
          { name: "Extensión de cuádriceps", sets: 3, reps: "15", rpe: 8 },
          { name: "Curl femoral tumbado", sets: 3, reps: "12", rpe: 8 },
          { name: "Adducción en maquina", sets: 3, reps: "14", rpe: 7 },
          { name: "Gemelos sentado", sets: 4, reps: "20", rpe: 8 }
        ]
      }
    ]
  }
]

// Función seed
async function seedRutinas() {
  try {
    const batch = db.batch()

    rutinas.forEach(rutina => {
      const docRef = db.collection('workouts_templates').doc()
      batch.set(docRef, rutina)
    })

    await batch.commit()
    console.log('Rutinas insertadas con éxito.')
  } 
  catch (error) {
    console.error('Error al insertar rutinas:', error)
  } 
  finally {
    process.exit()
  }
}

seedRutinas()
