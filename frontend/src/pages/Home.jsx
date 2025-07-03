import {Link} from 'react-router-dom';
import {useEffect, useState } from 'react';
import '../css/App.css';
import { addUser} from '../services/firestoreService.js'

export const Home = () => {

const newUser = {
  uid: "123abc",
  email: "ejemplo@correo.com",
  displayName: "Usuario Ejemplo",
  role: "free",
  createdAt: new Date()
};

addUser(newUser)
  .then((id) => console.log("Usuario añadido con id:", id))
  .catch(console.error);

    return (
    <>
        <div>Hola: {newUser.displayName}</div>
   
    </>

    )
}

export default Home;