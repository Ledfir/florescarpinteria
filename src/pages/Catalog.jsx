import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Modal3D from '../components/Modal3D'

export default function Catalog({products}){
  const [cat,setCat]=useState('Todo')
  const [show3DModal,setShow3DModal]=useState(false)
  const cats=['Todo',...new Set(products.map(p=>p.category))]
  const filtered=cat==='Todo'?products:products.filter(p=>p.category===cat)
  
  const models3D=[
    {
      id:'organizador-flotante',
      name:'Organizador Flotante',
      description:'70 × 55 × 15 cm · Melamina blanca'
    },
    {
      id:'closet-organizador',
      name:'Closet Organizador',
      description:'120 × 180 × 50 cm · Madera nogal'
    }
  ]

  return <main className="catalog">
    <section className="page-title">
      <p className="eyebrow">Piezas para vivir</p>
      <h1>Nuestra colección</h1>
      <p>Inspírate con estas piezas. Todas pueden adaptarse a las dimensiones, materiales y detalles de tu espacio.</p>
    </section>
    <div className="filters">
      {cats.map(c=><button onClick={()=>setCat(c)} className={c===cat?'active':''} key={c}>{c}</button>)}
    </div>
    <div className="product-grid all-products">
      {filtered.map(p=><ProductCard key={p.id} p={p}/>)}
    </div>
    
    <section className="section-3d-models">
      <div className="section-3d-header">
        <div>
          <p className="eyebrow">Experiencia interactiva</p>
          <h2>Visualiza nuestros muebles en 3D</h2>
          <p>Explora los modelos en tres dimensiones y conoce cada detalle de nuestros diseños. Puedes interactuar con ellos para verlos desde cualquier ángulo.</p>
        </div>
        <button className="button" onClick={()=>setShow3DModal(true)}>
          Ver modelos 3D <ArrowRight size={18}/>
        </button>
      </div>
    </section>
    
    <Modal3D isOpen={show3DModal} close={()=>setShow3DModal(false)} models={models3D}/>
  </main>
}
