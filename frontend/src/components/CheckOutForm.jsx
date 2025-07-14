import { 
    CardElement, // Input que contiene el numero de la tarjeta, fecha de caducidad y cvc
    useStripe, 
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    } from '@stripe/react-stripe-js';
import { useState, useEffect, useStatem } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';


const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        card: elements.getElement(CardExpiryElement),
        card: elements.getElement(CardCvcElement),
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Pago completado 🎉');
        navigate('/checkout/success')
      }
    }

    setIsLoading(false);
  };

const myStyle = {
  base: {
    fontSize: '1rem',
    color: '#14171A',
    fontWeight: '600',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    letterSpacing: '0.02em',
    padding: '0.75rem 0.75rem',
    '::placeholder': {
      color: '#657786',  // gris
      fontWeight: '400',
    },
    ':-webkit-autofill': {
      color: '#14171A',
    },
  },
  invalid: {
    color: '#E0245E', // rojo 
    iconColor: '#E0245E',
  }

};

return (
  <form className="checkout" onSubmit={handleSubmit}>
    <h2>Pago con tarjeta</h2>

    <div className="input-group">
      <label>Nombre completo</label>
      <input
        type="text"
        name="name"
        placeholder="Nombre y Apellidos"
        required
        className="stripe-input"
      />
    </div>

    <div className="input-group">
      <label>Número de tarjeta</label>
      <CardNumberElement
        options={{ style: myStyle }}
        className="stripe-input"
      />
    </div>

    <div className="input-group">
      <div>
        <label>Fecha vencimiento</label>
        <CardExpiryElement
          options={{ style: myStyle }}
          className="stripe-input"
        />
      </div>

      <div className="input-group">
        <label>CVC</label>
        <CardCvcElement
          options={{ style: myStyle }}
          className="stripe-input"
        />
      </div>
    </div>

    <button className="btn" type="submit">Pagar</button>
  </form>
);

}

export default CheckoutForm;