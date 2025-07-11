import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth} from "../context/AuthProvider";
import { Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (err) {
      setError("Credenciales incorrectas. Inténtelo nuevamente.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="cultura-fit">Cultura Fit</h2>

        {error && (
          <div className="error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="form.login">
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
      </div>
    </div>
  );
};

export default Login;
