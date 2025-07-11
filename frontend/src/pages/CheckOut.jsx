import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "../context/AuthProvider";
import { getIdToken  } from "firebase/auth";
import CheckoutForm from "../components/CheckOutForm";
import axios from 'axios'
import { useLocation } from "react-router-dom";
import { appearance } from "../../controllers/checkout";
import {fetchClientSecret} from "../../controllers/checkout"


// Carga tu clave pública de Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckOut = () => {
  const location = useLocation()
  const [clientSecret, setClientSecret] = useState()
  const {user} = useAuth()

useEffect (() =>  {
  const createPaymentIntent = async () => {
    const resdataClientSecret = await fetchClientSecret(user)
    console.log(resdataClientSecret)
    setClientSecret(resdataClientSecret)
    }
    createPaymentIntent();
}, [])

  const options = {
    clientSecret,
    appearance
  };

    console.log(clientSecret)

    //Se montan los métodos de pago

  return (
    <div>
      <h2>Checkout</h2>
      {clientSecret ? (
        // Elements es un proveedor de contexto. Pasa el contexto y da acceso a Stripe al componente hijo
        // Permite configurar el pago con confirmCardPayment y usar los hooks useStripe y useElements
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret}/>
        </Elements>
      ) : (
        <div>Cargando...</div>
      )}
    </div>
  );
}


export default CheckOut