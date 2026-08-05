import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../supabase'

export default function Login({onLogin}){
  const nav=useNavigate()
  const [email,setEmail]=useState('')
  const [pass,setPass]=useState('')
  const [error,setError]=useState('')
  const [busy,setBusy]=useState(false)

  async function submit(e){
    e.preventDefault()
    setError('')
    if(!supabase){
      setError('Agrega tus credenciales de Supabase en .env para iniciar sesión.')
      return
    }
    setBusy(true)
    const {data,error}=await supabase.auth.signInWithPassword({email,password:pass})
    setBusy(false)
    if(error)setError(error.message)
    else{
      onLogin(data.user)
      nav('/admin')
    }
  }

  return <main className="auth">
    <Link className="brand" to="/"><img src="/favicon.svg" alt="Logo" className="brand-logo"/><b>Carpinteria Flores</b></Link>
    <form onSubmit={submit}>
      <p className="eyebrow">Acceso privado</p>
      <h1>Bienvenido</h1>
      <p>Ingresa para administrar la colección.</p>
      <label>Correo<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Contraseña<input type="password" value={pass} onChange={e=>setPass(e.target.value)} required/></label>
      {error&&<p className="form-error">{error}</p>}
      <button className="button" disabled={busy}>{busy?'Ingresando…':'Ingresar'} <ArrowRight size={18}/></button>
    </form>
  </main>
}
