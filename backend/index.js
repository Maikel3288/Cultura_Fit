import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';


const fastify = Fastify();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware CORS en Fastify
await fastify.register(cors, {
  origin: '*',
});

// Rutas
import helloWorld from './routes/helloWorld.js';
fastify.register(helloWorld, { prefix: '/helloWorld'});

//Añadir datos al servidor
import {quickstartAddData} from './controllers/quickstartAddData.js'
//quickstartAddData()

// Iniciar servidor
fastify.listen({ port: PORT, host: HOST}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor escuchando en ${address}`);
});
