import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";

export default function LoginForm() {
    const {login} = useAuth();
    const [form, setForm] = useState({email: '', password: ''})

    const handleSubmit = (e) => {
        e.preventDefault();
        login(form.email, form.password)
    }

  return (
    <>
        <form className="login" onSubmit={handleSubmit}>
            <input placeholder="Email" value={form.email} onChange={(e)=> setForm({...form, email: e.target.value})} ></input>
            <input placeholder="Password" value={form.password} onChange={(e)=> setForm({...form, password: e.target.value})}></input>
            <button className ="btn" type="submit">Iniciar sesión</button>
        </form>
    </>
  ) 
}
