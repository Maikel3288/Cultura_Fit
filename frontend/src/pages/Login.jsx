import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth} from "../context/AuthProvider";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../../config/firebase"



const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError("Credenciales incorrectas. Inténtelo nuevamente.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Por favor, introduce tu correo para recuperar la contraseña.");
      return;
    }

  
  const actionCodeSettings = {
    url: `${frontendUrl}/login`, // <-- Redirección después de resetear la contraseña
    handleCodeInApp: false
  };


    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setError("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
    } catch (err) {
      setError("No se pudo enviar el correo. Verifica el correo ingresado.");
    }
  };

  

  return (
    <div className="container">
      <div className="card">
        <h2 className="cultura-fit">Cultura Fit</h2>

        {error && (
          <div className="error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            placeholder="Correo electrónico: tucorreo@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn" style={{  width: "50%" }}>
            Entrar
          </button>
        </form>

        <p className="register">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>

        <p>
          <button
            type="button"
            className="password-recovery"
            onClick={handlePasswordReset}
          >
            ¿Has olvidado la contraseña?
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
