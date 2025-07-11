import {loadStripe} from '@stripe/stripe-js';
import axios from 'axios'
import { getIdToken } from 'firebase/auth';
import { useAuth } from '../src/context/AuthProvider';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
export const stripePromise = loadStripe("pk_test_51RVbJnFLiEmdxnPslJ3Yhs2tmNsi1azDOXkPzMTfE0W5O5Tn7gJJO8qNRsGh8mxdRZOlyi3Di3xlkkE498p2Okti00AbaQ5EXT");

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

