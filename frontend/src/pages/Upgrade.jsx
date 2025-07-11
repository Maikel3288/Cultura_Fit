import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { getIdToken } from "firebase/auth";
import axios from 'axios'
import {fetchClientSecret} from "../../controllers/checkout"

export const Upgrade = () => {
  const {user} = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    setLoading(true);
    navigate('/checkout');
    setLoading(false)

    return 

  };

    useEffect(() => {
    if (!loading && user?.role === "premium") {
      // Si es premium y está en /upgrade, lo mando a /success
      navigate("/success", { replace: true });
    }
  }, [user, loading, navigate]);


  return (
    <div className="container card">
      <h2 className="cultura-fit">Hazte Premium</h2>
      <p>Accede a entrenamientos exclusivos, métricas avanzadas y más.</p>

      <ul style={{ listStyle: 'none'}}>
        <li>✔️ Planes personalizados</li>
        <li>✔️ Seguimiento de rendimiento</li>
        <li>✔️ Soporte prioritario</li>
      </ul>

        <button className="btn" onClick={handleUpgrade} disabled={loading}>
        {loading ? "Redirigiendo..." : "Actualizar a Premium"} 
      </button>

    </div>
  );
}
 

export default Upgrade