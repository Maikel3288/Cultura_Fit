import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios'
import { getIdToken } from 'firebase/auth';
import { useAuth } from '../src/context/AuthProvider';

// Carga la clave pública de Stripe
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const fetchClientSecret = async (user) => {

    const idToken = await getIdToken(user)

    // Llamada al servidor para crear sesión de checkout
    console.log(idToken)
    const res = await axios.post(`${backendUrl}/api/checkout/create-payment-intent`, 
      {},
      {
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}`}
    });
    return res.data.clientSecret
};

export const appearance = {
    theme: 'stripe',
  };



