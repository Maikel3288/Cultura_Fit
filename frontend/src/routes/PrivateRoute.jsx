// src/routes/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoute = ({ children, requiredRole = "free" }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (requiredRole === 'premium' && user.role !== 'premium') return <Navigate to="/upgrade" />;
    
  //Devuelve el componente hijo si el usuario se encuentra autenticado y tiene el rol adecuado
  return children


}

export default PrivateRoute