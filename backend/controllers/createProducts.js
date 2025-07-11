import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from "stripe";

// Resolver __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stripePrivateKey= path.resolve(__dirname, '..', '..', process.env.STRIPE_PRIVATE_KEY);

// Se inicializa Stripe con la clave privada
const stripe = new Stripe(stripePrivateKey);


const product = await stripe.products.create({
  name: 'Basic Dashboard',
  default_price_data: {
    unit_amount: 8.95,
    currency: 'eur',
    recurring: {
      interval: 'month',
    },
  },
  expand: ['default_price'],
});