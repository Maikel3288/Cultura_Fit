import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';


const fastify = Fastify({ logger: true });

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware CORS en Fastify
await fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});


// Rutas
import userRoutes from './routes/user/user.js'
fastify.register(userRoutes, {prefix: '/api/users'})
import {checkOut} from './routes/checkout.js'
fastify.register(checkOut, {prefix: '/api/checkout'})
import {workouts} from './routes/workouts.js'
fastify.register(workouts, {prefix: '/api/workouts'})
import {rutines} from './routes/rutines.js'
fastify.register(rutines, {prefix: '/api/rutines'})



// Iniciar servidor
fastify.listen({ port: PORT, host: HOST}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor escuchando en ${address}`);
});
