const fastify = require('fastify')({ logger: true });
require('dotenv').config();
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Middleware CORS en Fastify
fastify.register(require('@fastify/cors'), {
  origin: '*',
});

// Rutas
fastify.get('/', async (request, reply) => {
  return { hello: 'hola world' };
});


// Iniciar servidor
fastify.listen({ port: PORT }, {host: HOST}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Servidor escuchando en ${address}`);
});
