//import { useState } from 'react'
import './css/App.css'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import './css/index.css';
import { AuthProvider } from './context/AuthProvider';
import LoginForm from "./components/auth/LoginForm";
import UserProfile from "./components/auth/UserProfile";
import PrivateRoute from "./routes/PrivateRoute";
import Register from "./pages/Register"

function App() {


  return (
    <>
  
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element = {<Register/>}/>
        <Route path="/profile" element = {
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
    </>
  )
}

export default App
