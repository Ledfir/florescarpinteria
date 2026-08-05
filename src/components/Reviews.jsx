import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: 'Joaquín Delgado',
    title: 'COLECCIONISTA DE ARTE',
    avatar: 'J',
    stars: 5,
    text: '"Tras quince años buscando un librero que no impusiera su forma sobre los libros, encontré en Flores exactamente lo que necesitaba. Roble macizo, líneas arquitectónicas, cero ornamentación. Es un mueble que desaparece para dejar vivir lo que contiene."'
  },
  {
    id: 2,
    name: 'María García',
    title: 'DISEÑADORA DE INTERIORES',
    avatar: 'M',
    stars: 5,
    text: '"La calidad es incomparable. Cada detalle muestra la dedicación artesanal. Mis clientes siempre quedan maravillados con los muebles. Recomiendo Madera Luz sin dudarlo."'
  },
  {
    id: 3,
    name: 'Carlos Mendoza',
    title: 'ARQUITECTO',
    avatar: 'C',
    stars: 5,
    text: '"Integrar piezas de Madera Luz en proyectos residenciales ha sido transformador. El compromiso con la calidad y el diseño atemporal es evidente en cada mueble."'
  }
]

export default function Reviews(){
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((current + 1) % reviews.length)
  const prev = () => setCurrent((current - 1 + reviews.length) % reviews.length)

  return <section className="reviews">
    <div className="reviews-header">
      <div>
        <p className="eyebrow">RESEÑAS</p>
        <h2 style={{ color: '#ffffff' }}>Voces del <i>taller</i></h2>
      </div>
      <p>Quienes confían en nosotros comparten su experiencia. Cada proyecto, una conversación entre la madera y quien la habita.</p>
    </div>

    <div className="reviews-carousel">
      {reviews.map((review, index) => (
        <div key={review.id} className={`review-slide ${index === current ? 'active' : ''}`}>
          <div className="review-content">
            <div className="review-stars">
              {[...Array(review.stars)].map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
            </div>
            <p className="review-text">{review.text}</p>
            <div className="review-author">
              <div className="review-avatar">{review.avatar}</div>
              <div>
                <strong>{review.name}</strong>
                <p>{review.title}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="reviews-controls">
      <div className="review-indicators">
        {reviews.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
      <div className="review-nav">
        <button onClick={prev} className="nav-btn prev"><ChevronLeft size={20}/></button>
        <button onClick={next} className="nav-btn next"><ChevronRight size={20}/></button>
      </div>
    </div>
  </section>
}
