import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { money } from '../utils/formatters'

export default function ProductDetail({products}){
  const { id } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.id === id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if(!product){
    return <div className="modal-backdrop" onClick={() => navigate(-1)}>
      <div className="product-detail-modal" onClick={e => e.stopPropagation()}>
        <p>Producto no encontrado</p>
      </div>
    </div>
  }

  // Usar múltiples imágenes del producto o fallback al image_url
  const images = product.images && product.images.length > 0 ? product.images : [product.image_url]

  const nextImage = () => setCurrentImageIndex((currentImageIndex + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)

  return <div className="modal-backdrop" onClick={() => navigate(-1)}>
    <div className="product-detail-modal" onClick={e => e.stopPropagation()}>
      <button className="close-detail" onClick={() => navigate(-1)}><X size={24}/></button>

      <div className="detail-container">
        <div className="detail-images">
          <div className="detail-label">FICHA TÉCNICA</div>
          <div className="main-image">
            <img src={images[currentImageIndex]} alt={product.name}/>
            {images.length > 1 && (
              <>
                <button className="nav-arrow prev" onClick={prevImage}><ChevronLeft size={32}/></button>
                <button className="nav-arrow next" onClick={nextImage}><ChevronRight size={32}/></button>
              </>
            )}
            <div className="image-counter">{currentImageIndex + 1} / {images.length}</div>
          </div>
          
          {images.length > 1 && (
            <div className="thumbnail-images">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`}/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="detail-content">
          <div className="detail-header">
            <h1>{product.name}</h1>
            <p className="detail-description">{product.description}</p>
          </div>

          <div className="detail-price">
            <span>Desde </span>
            <strong>{money(product.price)}</strong>
            <span>MXN</span>
          </div>

          <div className="detail-specs">
            <div className="spec-section">
              <p className="spec-label">MATERIAL</p>
              <h3>{product.material}</h3>
            </div>

            <div className="spec-section">
              <p className="spec-label">CONSTRUCCIÓN</p>
              <h3>Ensambles</h3>
            </div>

          </div>

          <button className="button detail-button">Solicitar especificación</button>
        </div>
      </div>
    </div>
  </div>
}
