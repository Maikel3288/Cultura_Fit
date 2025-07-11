import React, { useState, useEffect, useMemo } from "react";

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    const data = axios.get(`/session-status?session_id=${sessionId}`)
        setStatus(data.status);
        setCustomerEmail(data.customer_email);
     ;
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.

          If you have any questions, please email <a href="mailto:orders@cultura-fit.com">orders@cultura-fit.com</a>.
        </p>
      </section>
    )
  }

  return null;
}

export default Return