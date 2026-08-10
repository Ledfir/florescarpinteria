import React from 'react'
import { X } from 'lucide-react'
import Card3D from './Card3D'

export default function Modal3D({ isOpen, close, models }) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-3d" onClick={e => e.stopPropagation()} style={{ animation: 'fadeIn 0.3s ease-out', backgroundColor: '#f5f5f5' }}>
        <button type="button" className="close" onClick={close}>
          <X />
        </button>
        <p className="eyebrow">Catálogo 3D</p>
        <h2>Nuestros modelos en 3D</h2>
        <p className="modal-3d-description">Selecciona cualquier modelo para verlo en detalle de forma interactiva.</p>
        
        <div className="models-gallery">
          {models.map((model, idx) => (
            <Card3D key={idx} model={model} />
          ))}
        </div>
      </div>
    </div>
  )
}
