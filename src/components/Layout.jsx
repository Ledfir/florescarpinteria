import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowRight, CircleUserRound, Instagram, Mail, Menu, Phone, X } from 'lucide-react'

export default function Layout({children,user}){
  const [open,setOpen]=useState(false)
  return <>
    <header>
      <Link className="brand" to="/"><img src="/favicon.svg" alt="Logo" className="brand-logo"/><b>Carpinteria Flores</b></Link>
      <button className="menu" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
      <nav className={open?'open':''}>
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/about">Nosotros</NavLink>
        <NavLink to="/catalogo">Colección</NavLink>
        <NavLink to="/contacto">Contacto</NavLink>
        {user?<Link className="admin-link" to="/admin"><CircleUserRound size={17}/> Administrar</Link>:<Link className="admin-link" to="/login">Ingresar <ArrowRight size={16}/></Link>}
      </nav>
    </header>
    {children}
    <footer>
      <div className="brand footer-brand"><img src="/favicon.svg" alt="Logo" className="brand-logo"/><b>Carpinteria Flores</b></div>
      <p>Diseñamos espacios que cuentan tu historia.</p>
      <div>
        <a href="https://www.instagram.com/flores.carpinteria_arch/" target="_blank" rel="noopener noreferrer"><Instagram size={18}/></a>
        <a href="mailto:flores.carpinteriarch@gmail.com"><Mail size={18}/></a>
        <a href="tel:+528124249620"><Phone size={18}/></a>
      </div>
      <small>© {new Date().getFullYear()} Carpinteria Flores · Hecho en México | Desarrollado por <a style={{ color: '#000000' }} href="https://aflores.vercel.app" target="_blank" rel="noopener noreferrer">Aflores</a></small>
    </footer>
  </>
}
