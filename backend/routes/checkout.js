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

fastify.post("/create-payment-intent", async (req, reply) => {
    const auth = await authenticate(req, reply);

    if (!auth) return reply.code(401).send({ message: `Error en la autorización` });

    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'eur',
        // Se asocia el intento de pago al usuario
        metadata: {
            firebaseUID: req.user.uid,
            email: req.user.email,
        }
    });


    reply.send({ clientSecret: paymentIntent.client_secret });
   
});

}