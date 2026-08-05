import React from 'react'
import { Mail, MapPin, Phone, ArrowRight } from 'lucide-react'

export default function Contact(){
  return <main className="contact">
    <section>
      <p className="eyebrow">Hablemos de tu espacio</p>
      <h1>Tu idea merece<br/><i>tomar forma.</i></h1>
      <p className="lead">Cuéntanos qué imaginas. Te respondemos para comenzar a diseñar juntos.</p>
      <div className="contact-details">
        <p><MapPin/> Ciudad de México, MX</p>
        <p><Phone/> +52 55 0000 0000</p>
        <p><Mail/> hola@maderaluz.mx</p>
      </div>
    </section>
    <form onSubmit={e=>{e.preventDefault();e.currentTarget.reset();alert('¡Gracias! Te contactaremos muy pronto.')}}>
      <label>Tu nombre<input required placeholder="¿Cómo te llamas?"/></label>
      <label>Correo electrónico<input type="email" required placeholder="tu@correo.com"/></label>
      <label>Tipo de proyecto<select defaultValue=""><option disabled value="">Selecciona una opción</option><option>Comedor</option><option>Sala</option><option>Recámara</option><option>Oficina</option><option>Otro</option></select></label>
      <label>Cuéntanos tu idea<textarea required rows="4" placeholder="Medidas, materiales, inspiración…"/></label>
      <button className="button" type="submit">Enviar mensaje <ArrowRight size={18}/></button>
    </form>
  </main>
}
