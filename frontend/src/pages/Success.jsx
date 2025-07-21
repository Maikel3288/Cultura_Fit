import { useLocation, Navigate } from "react-router-dom";

const Success = () => {
  const location = useLocation();

  // Si no viene desde el flujo de pago, redirige a Home
  if (!location.state?.justPaid) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="container-card">
      <h2>¡Gracias por hacerte Premium! 🎉</h2>
      <p>Ahora puedes acceder a todas las funciones exclusivas.</p>
    </div>
  );
}


export default Success