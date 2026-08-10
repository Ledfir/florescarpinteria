import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Card3D({ model }) {
  return (
    <div className="card-3d">
      <div className="card-3d-content">
        <div className="card-3d-icon">
          <span>3D</span>
        </div>
      </div>
      <div className="card-3d-footer">
        <h3>{model.name}</h3>
        <p>{model.description}</p>
        <Link to={`/modelo-3d/${model.id}`} className="card-3d-button">
          Ver modelo completo <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
