import { useAuth } from "../../context/AuthProvider";
import { Navigate } from "react-router-dom";

export default function UserProfile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p>Email: {user?.email}</p>
      <p>Rol: {user?.role}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
