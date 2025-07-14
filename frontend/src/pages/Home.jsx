import {Link} from 'react-router-dom';
import {useEffect, useState } from 'react';
import '../css/App.css';
import { addUser} from '../routes/firestoreService.js'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { MdOutlineWorkspacePremium } from "react-icons/md";

export const Home = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleUpgrade = () => {
    navigate("/upgrade");
  };

  return (
    <div className="container">
      {/* Barra superior */}
      <div className="top-bar">
          <button className="btn" onClick={handleUpgrade}>Upgrade <MdOutlineWorkspacePremium size={24}/></button>
          <button className="btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    <div className="home-container">
      {/* Barra lateral */}
      <aside className="sidebar">
        <h2 className="cultura-fit">Cultura Fit</h2>

        <nav className="nav-menu">
          <a href="#" className="nav-item">Inicio</a>
          <a href="#" className="nav-item">Calendario</a>
          <a href="#" className="nav-item">Rendimiento</a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">

        <section>
          <h1>Bienvenido a tu espacio Cultura Fit 💪</h1>
          <p>Selecciona una opción del menú para empezar.</p>
        </section>
      </main>
    </div>
    </div>
  );
}


export default Home;