import fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();

import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';




const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware CORS en Fastify
fastify.register(require('@fastify/cors'), {
  origin: '*',
});

// Rutas
const helloWorld = require('./routes/helloword.js');
fastify.register(helloWorld, { prefix: '/helloword'});

//Añadir datos al servidor
import {quickstartAddData, db} from '.controllers/quickstartAddData.js';
quickstartAddData(db)

// Iniciar servidor
fastify.listen({ port: PORT, host: HOST}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor escuchando en ${address}`);
});
