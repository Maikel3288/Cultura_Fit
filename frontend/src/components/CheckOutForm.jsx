import { 
    EmbeddedCheckoutProvider, 
    EmbeddedCheckout, 
    CardElement, 
    useStripe, 
    useElements,
    PaymentElement,
    useCheckout, } from '@stripe/react-stripe-js';
import { stripePromise, fetchClientSecret, appearance } from '../../controllers/checkout';
import { useEffect, useState } from 'react';



const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Aquí puedes personalizar la URL de éxito
        return_url: "https://localhost:5000/checkout/success",
      },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage("Procesando el pago...");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button className="btn" style={{ marginTop: '1rem' }} disabled={isLoading || !stripe || !elements} id="submit">
        {isLoading ? "Procesando..." : "Pagar"}
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default CheckoutForm;