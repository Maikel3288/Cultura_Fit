// src/types/models.ts

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "free" | "premium"; // Nivel de membresía del usuario
  createdAt: Date;          // Fecha de creación del usuario
}

export interface Subscription {
  userId: string;           // Referencia al usuario
  status: "active" | "cancelled" | "past_due";
  plan: string;             // Identificador del plan (ej: "premium_monthly")
  startDate: Date;
  endDate?: Date;           // Opcional, si la suscripción expiró
}

export interface Exercise {
  name: string;             // Nombre del ejercicio
  sets: number;             // Series
  reps: number;             // Repeticiones
  restSeconds?: number;     // Descanso opcional entre series
}

export interface Workout {
  id?: string;              // Id asignado por Firestore (opcional aquí)
  title: string;            // Nombre de la rutina
  description?: string;     // Descripción breve
  objective: "strength" | "cardio" | "flexibility" | "other";  // Objetivo principal
  exercises: Exercise[];    // Lista de ejercicios
  createdAt?: Date;         // Fecha de creación (opcional)
}

export interface CalendarEvent {
  id?: string;
  userId: string;
  workoutId: string;
  date: Date;              // Fecha asignada al entrenamiento
}
