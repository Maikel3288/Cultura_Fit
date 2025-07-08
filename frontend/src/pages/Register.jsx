import {useContext, useEffect, useState } from 'react';
import '../css/App.css';
import {useAuth} from '../context/AuthProvider.jsx'

import RegisterForm from '../components/auth/RegisterForm';

export default function Register() {

    const {user, register}  = useAuth()

    if (!user) 
        return (
            <div>
            <h1>Crear cuenta</h1>
            <RegisterForm />
            </div>
    );

}
