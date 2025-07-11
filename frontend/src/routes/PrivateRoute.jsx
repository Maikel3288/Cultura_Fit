// src/routes/PrivateRoute.jsx
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

const PrivateRoute = ({requiredRole = "free" }) => {
  const { user } = useAuth();
  const [hasPaid, setHasPaid] = useState(false);
  const location = useLocation();
  

  if (!user) return <Navigate to="/login" />;

  if (requiredRole === 'premium' && user.role !== 'premium') return <Navigate to="/upgrade" />;
    

  //Renderiza las rutas hijas. Esto permite no pasar children como prop manualmente
  return <Outlet />;


}

export default PrivateRoute