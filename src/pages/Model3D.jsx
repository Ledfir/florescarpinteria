import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import FloatingOrganizer from '../components/FloatingOrganizer.preview'
import ClosetOrganizer from '../components/ClosetOrganizer.preview'

const MODELS_3D = {
  'organizador-flotante': {
    name: 'Organizador Flotante',
    description: 'Secuencia de ensamblaje automática · 70 × 55 × 15 cm · Melamina blanca',
    fullDescription: 'Explora el modelo 3D interactivo del Organizador Flotante. Arrastra con el mouse para rotar la vista desde cualquier ángulo. Observa el proceso de ensamblaje automático de todas las piezas que componen este mueble moderno.',
    component: FloatingOrganizer
  },
  'closet-organizador': {
    name: 'Closet Organizador',
    description: 'Secuencia de ensamblaje automática · 120 × 180 × 50 cm · Madera nogal',
    fullDescription: 'Visualiza el completo proceso de ensamblaje del Closet Organizador. Un mueble versátil con barras de colgar, estantes fijos y divisiones que ofrecen múltiples opciones de almacenamiento. Arrastra para rotar y conocer cada detalle.',
    component: ClosetOrganizer
  }
}

export default function Model3D(){
  const { modelId } = useParams()
  const model = MODELS_3D[modelId]

  if(!model) {
    return (
      <main className="model-3d-page">
        <section className="model-error">
          <h1>Modelo no encontrado</h1>
          <Link to="/catalogo" className="button">Volver al catálogo</Link>
        </section>
      </main>
    )
  }

  const ModelComponent = model.component

  return (
    <main className="model-3d-page">
      <div className="model-3d-header">
        <Link to="/catalogo" className="back-button">
          <ArrowLeft size={20} />
          Volver
        </Link>
      </div>

      <section className="model-3d-container">
        <div className="model-3d-viewer">
          <ModelComponent />
        </div>

        <aside className="model-3d-info">
          <p className="eyebrow">Modelo Interactivo</p>
          <h1>{model.name}</h1>
          <p className="model-description">{model.fullDescription}</p>
          <div className="model-specs">
            <h3>Especificaciones</h3>
            <p>{model.description}</p>
          </div>
          <div className="model-controls">
            <p className="control-hint">💡 Arrastra con el mouse para rotar el modelo</p>
            <p className="control-hint">🔄 Haz clic en "Reiniciar ensamblaje" para reproducir la animación</p>
          </div>
        </aside>
      </section>
    </main>
  )
}
