import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function Contact(){
  return <main className="contact">
    <section className="contact-header">
      <p className="eyebrow">:: ENCARGO</p>
      <h1>El Libro del<br/><i>Carpintero</i></h1>
      <p className="lead">Inicia tu proyecto. Cada encargo comienza con una conversación.</p>
    </section>
    
    <form onSubmit={e=>{e.preventDefault();e.currentTarget.reset();alert('¡Gracias! Te contactaremos muy pronto.')}} className="contact-form">
      <div className="form-grid">
        <div className="form-field">
          <label className="field-label">01 - NOMBRE</label>
          <input type="text" required placeholder="Tu nombre"/>
        </div>
        
        <div className="form-field">
          <label className="field-label">02 - EMAIL</label>
          <input type="email" required placeholder="tu@email.com"/>
        </div>
        
        <div className="form-field">
          <label className="field-label">03 - TELÉFONO</label>
          <input type="tel" required placeholder="+52"/>
        </div>
        
        <div className="form-field">
          <label className="field-label">04 - TIPO DE PROYECTO</label>
          <select defaultValue="">
            <option disabled value="">Selecciona una opción</option>
            <option>Mueble a medida</option>
            <option>Comedor</option>
            <option>Sala</option>
            <option>Recámara</option>
            <option>Oficina</option>
            <option>Otro</option>
          </select>
        </div>
      </div>
      
      <div className="form-field full-width">
        <label className="field-label">05 - DESCRIPCIÓN DEL PROYECTO</label>
        <textarea required rows="4" placeholder="Cuéntanos sobre la pieza que imaginas…"/>
      </div>
      
      <button className="button" type="submit">ENVIAR SOLICITUD <ArrowRight size={18}/></button>
    </form>

    <section className="contact-info-section">
      <div className="contact-info-container">
        <div className="contact-details">
          <h2>Flores Carpintería</h2>
          <p className="info-label">Dirección</p>
          <p className="info-text">San German #526, Santa Monica 13 Sector, Juarez, N.L., México</p>
          
          <p className="info-label">Teléfono</p>
          <p className="info-text"><a href="tel:+528124249620">+52 81 2424 9620</a></p>
          
          <p className="info-label">Correo</p>
          <p className="info-text"><a href="mailto:flores.carpinteriarch@gmail.com">flores.carpinteriarch@gmail.com</a></p>
          
          <p className="info-label">Horario</p>
          <p className="info-text">Lunes a Viernes: 9:00 - 18:00<br/>Sábado: 10:00 - 14:00</p>
        </div>
        
        <div className="contact-map">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3597.785343562717!2d-100.173987825149!3d25.61204821477389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8662c15f9e72cbcf%3A0x832540885626682c!2sC.%20San%20Germ%C3%A1n%20526%2C%20Santa%20Monica%20Sect%2013%2C%20Jardines%20de%20la%20Silla%2C%2067250%20Jardines%20de%20la%20Silla%2C%20N.L.!5e0!3m2!1ses-419!2smx!4v1786037423875!5m2!1ses-419!2smx" 
            width="100%" 
            height="400" 
            style={{border: 0}} 
            allowFullScreen
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    </section>
  </main>
}
