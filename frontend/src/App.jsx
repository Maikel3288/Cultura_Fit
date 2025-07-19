//import { useState } from 'react'
import './css/App.css'
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import './css/index.css';
import { AuthProvider } from './context/AuthProvider';
import LoginForm from "./components/auth/LoginForm";
import UserProfile from "./components/auth/UserProfile";
import PrivateRoute from "./routes/PrivateRoute";
import Register from "./pages/Register"
import Login from "./pages/Login"
import Upgrade from './pages/Upgrade';
import {CheckoutProvider} from '@stripe/react-stripe-js';
import CheckOut from './pages/CheckOut.jsx'
import Return from './components/Return.jsx' 
import Success from './pages/Success.jsx';
import WorkOut from './pages/WorkOut.jsx';
import { ActiveRutineProvider } from './context/ActiveRutineProvider.jsx';


function App() {

  return (
    <>
    <AuthProvider>
      <ActiveRutineProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element = {<Register/>}/>

      <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element = { <UserProfile />}/>
          <Route path="/upgrade" element = {<Upgrade/>}/>
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/checkout/success" element={<Success />} />
          <Route path="/return" element={<Return />} />
        </Route>

    
      </Routes>
      </ActiveRutineProvider>
    </AuthProvider>
    </>
  )
}

export default App
