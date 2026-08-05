import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'

export default function Catalog({products}){
  const [cat,setCat]=useState('Todo')
  const cats=['Todo',...new Set(products.map(p=>p.category))]
  const filtered=cat==='Todo'?products:products.filter(p=>p.category===cat)

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
  </main>
}
