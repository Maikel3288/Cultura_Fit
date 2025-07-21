import { useState } from "react";
import { useAuth } from '../../context/AuthProvider.jsx';
import { useNavigate } from "react-router-dom";
import {syncUserClaims} from '../../../controllers/user.js'
import { getAuth } from "firebase/auth";

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", displayName: "", role: "free" });
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await register(form);

      const auth = getAuth()
      const currentUser = auth.currentUser;

      if (!currentUser) return 
      // Se refresca el token para que tenga el claim con el rol
      // await syncUserClaims()
      await currentUser.getIdToken(true); // true fuerza a refrescar token con claims nuevos
      navigate("/home")

    } 
    catch (err) {
      alert("Error al registrar: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nombre" onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
      <input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value.toLowerCase() })} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className = "btn" type="submit">Registrarse</button>
    </form>
  );
}
