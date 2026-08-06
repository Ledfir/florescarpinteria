import { ArrowRight, Check, Heart, Leaf, Ruler } from 'lucide-react'
import { Link } from 'react-router-dom'
import './About.css'

const values = [
  { icon: Heart, title: 'Hecho con intención', text: 'Escuchamos cómo vives antes de dibujar una sola línea. Cada decisión responde a ti y a tu espacio.' },
  { icon: Ruler, title: 'A tu medida', text: 'Diseñamos proporciones, materiales y detalles para que cada pieza se sienta naturalmente tuya.' },
  { icon: Leaf, title: 'Para quedarse', text: 'Elegimos maderas nobles y acabados durables para crear muebles que acompañen muchas historias.' },
]

export default function About() {
  return (
    <main className="about">
      <section className="about-hero">
        <div>
          <p className="eyebrow">Madera Luz · Desde 2016</p>
          <h1>Hacemos muebles<br />con <i>alma.</i></h1>
          <p className="lead">Somos un taller de carpintería en Ciudad de México. Diseñamos piezas honestas para espacios que se viven de verdad.</p>
        </div>
        <img src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1400&q=85" alt="Artesano trabajando la madera en el taller" />
      </section>

      <section className="about-story">
        <div className="story-photo"><img src="https://images.unsplash.com/photo-1541558869434-2840d308329a?auto=format&fit=crop&w=1000&q=85" alt="Detalles de una mesa de madera" /><p>Materia con memoria</p></div>
        <div><p className="eyebrow">Nuestro origen</p><h2>Una pieza puede cambiar cómo se siente un hogar.</h2><p>Todo comenzó con el deseo de hacer muebles que no fueran de paso. Muebles que guardaran las marcas de las comidas largas, las tardes de trabajo y los encuentros con quienes queremos.</p><p>Hoy, nuestro equipo reúne el oficio tradicional con un diseño sobrio y contemporáneo. Trabajamos cada encargo de manera cercana, desde la primera conversación hasta la última capa de aceite.</p></div>
      </section>

      <section className="about-values"><div className="about-values-heading"><p className="eyebrow">Así trabajamos</p><h2>El valor está en los detalles.</h2></div><div className="value-grid">{values.map(({ icon: Icon, title, text }) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="about-process"><div><p className="eyebrow">Un proceso compartido</p><h2>De tu idea a una pieza para toda la vida.</h2></div><ol><li><span>01</span><div><b>Conversamos</b><p>Conocemos tu espacio, tus necesidades y las referencias que te inspiran.</p></div></li><li><span>02</span><div><b>Diseñamos</b><p>Definimos la propuesta, las medidas y los materiales contigo.</p></div></li><li><span>03</span><div><b>Construimos</b><p>Trabajamos la pieza a mano y te mantenemos al tanto en cada etapa.</p></div></li><li><span>04</span><div><b>La llevamos a casa</b><p>Instalamos y cuidamos hasta el último detalle para que solo tengas que disfrutarla.</p></div></li></ol></section>

      <section className="about-cta"><Check /><div><p className="eyebrow">Tu próxima pieza empieza aquí</p><h2>¿Tienes un espacio en mente?</h2></div><Link className="button light" to="/contacto">Hablemos <ArrowRight size={18} /></Link></section>
    </main>
  )
}
