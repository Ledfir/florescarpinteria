import React from 'react'
import { Link } from 'react-router-dom'
import { money } from '../utils/formatters'

export default function ProductCard({p}){
  const imageUrl = p.images && p.images.length > 0 ? p.images[0] : p.image_url
  return <Link to={`/producto/${p.id}`} className="product-card-link">
    <article className="product-card">
      <div className="product-image">
        <img src={imageUrl} alt={p.name}/>
        <span>{p.category}</span>
      </div>
      <div>
        <h3>{p.name}</h3>
        <p>{p.material}</p>
        <strong>Desde {money(p.price)}</strong>
      </div>
    </article>
  </Link>
}
