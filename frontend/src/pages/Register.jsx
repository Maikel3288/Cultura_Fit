import {useContext, useEffect, useState } from 'react';
import '../css/App.css';
import {useAuth} from '../context/AuthProvider.jsx'

import RegisterForm from '../components/auth/RegisterForm';
import { MdHeight } from 'react-icons/md';

export default function Register() {

    const {user, register}  = useAuth()

    if (!user) 
    return (
        <div className="container" style={{width: '50%', minWidth: '540px'}}>
            <div className="card">
                <h2 className="cultura-fit">Crear cuenta</h2>
                    <RegisterForm />
            </div>
        </div>
    );

}
