import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight, Hammer } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Reviews from '../components/Reviews'

export default function Home({products}){
  return <main>
    <section className="hero">
      <div>
        <p className="eyebrow">Carpintería de autor · México</p>
        <h1>Muebles que<br/><i>habitan contigo.</i></h1>
        <p className="lead">Piezas pensadas para tu espacio, hechas a mano para durar toda la vida.</p>
        <Link className="button" to="/catalogo">Ver colección <ArrowRight size={18}/></Link>
      </div>
      <div className="hero-image">
        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85" alt="Sala con muebles de madera"/>
        <p>Hecho a mano<br/>con intención</p>
      </div>
    </section>

    <section className="intro">
      <p className="eyebrow">Nuestro oficio</p>
      <h2>De la madera a tu historia.</h2>
      <p>Cada veta, unión y acabado está trabajado con paciencia. Creamos muebles a medida que se sienten como parte de tu hogar desde el primer día.</p>
      <Link to="/contacto">Cuéntanos tu idea <ChevronRight size={17}/></Link>
    </section>

    <section className="featured">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Piezas seleccionadas</p>
          <h2>La colección</h2>
        </div>
        <Link to="/catalogo">Ver todo <ArrowRight size={17}/></Link>
      </div>
      <div className="product-grid">
        {products.slice(0,3).map(p=><ProductCard key={p.id} p={p}/>)}
      </div>
    </section>

    <section className="promise">
      <Hammer/>
      <div>
        <p className="eyebrow">Sin prisas, bien hecho</p>
        <h2>Tu espacio merece una pieza única.</h2>
      </div>
      <Link className="button light" to="/contacto">Iniciar proyecto <ArrowRight size={18}/></Link>
    </section>
    <section style={{background:'#2C2119',color:'#ffffff'}}>
        <Reviews/>
    </section>
  </main>
}
