import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import Fastify from "fastify";
import Stripe from "stripe";
import authenticate from '../controllers/authenticate.js';


// // Resolver __dirname en ESModules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const stripePrivateKey= process.env.STRIPE_SECRET_KEY;

const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'http://localhost:5000';

// Se crea la instancia de Fastify
const fastify = Fastify({ logger: true });

// Se inicializa Stripe con la clave privada
console.log(stripePrivateKey)
const stripe = new Stripe(stripePrivateKey);


export const checkOut = async (fastify) => {

fastify.post("/create-checkout-session", async (req, reply) => {
    
// Aquí podrías extraer el token del header si quieres:
  const authHeader = req.headers['authorization'] || '';
  const idToken = authHeader.replace('Bearer ', '');

  const isAuthenticated = await authenticate(req, reply);

  if (!isAuthenticated) return; 

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'eur',
    });


  return reply.send({ clientSecret: paymentIntent.client_secret });
   
});


fastify.get("/session-status", async (req, reply) => {
    const sessionId = req.query.session_id;

    if (!sessionId) {
        return reply.status(400).send({ error: 'session_id es requerido' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        return reply.send({
        status: session.payment_status,
        customer_email: session.customer_details?.email || '',
        });
    } 
    catch (error) {
        req.log.error(error); // Registro del error en el logger de Fastify
        return reply.status(500).send({ error: 'No se pudo recuperar la sesión' });
    }
});
}