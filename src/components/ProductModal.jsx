import React, { useState } from 'react'
import { Check, Upload, X } from 'lucide-react'
import { supabase } from '../supabase'
import { parseImages } from '../utils/formatters'

export default function ProductModal({product,close,save}){
  const [item,setItem]=useState(()=>{
    const images=parseImages(product.images)
    return {...product,images:images.length > 0 ? images : (product.image_url ? [product.image_url] : [])}
  })
  const [uploading,setUploading]=useState(false)
  const edit=(key,val)=>setItem(x=>({...x,[key]:typeof val === 'function' ? val(x[key]) : val}))

  async function upload(e){
    const files=Array.from(e.target.files||[])
    if(files.length===0||!supabase)return
    setUploading(true)
    const urls=[]
    for(const file of files){
      const path=`${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'-')}`
      const {error}=await supabase.storage.from('product-images').upload(path,file)
      if(error)alert(error.message)
      else{
        const {data}=supabase.storage.from('product-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    if(urls.length>0)edit('images', prev => [...prev, ...urls])
    setUploading(false)
    e.target.value=''
  }

  function removeImage(idx){
    edit('images',item.images.filter((_,i)=>i!==idx))
  }

  return <div className="modal-backdrop">
    <form className="modal" onSubmit={e=>{e.preventDefault();save({...item,price:Number(item.price),image_url:item.images[0]||'',images:item.images})}}>
      <button type="button" className="close" onClick={close}><X/></button>
      <p className="eyebrow">{item.id?'Editar pieza':'Nueva pieza'}</p>
      <h2>{item.id?'Actualizar producto':'Añadir producto'}</h2>
      <div className="modal-fields">
        <label>Nombre<input value={item.name} onChange={e=>edit('name',e.target.value)} required/></label>
        <label>Categoría<select value={item.category} onChange={e=>edit('category',e.target.value)}>
          <option>Comedor</option>
          <option>Sala</option>
          <option>Recámara</option>
          <option>Oficina</option>
        </select></label>
        <label>Precio desde<input type="number" value={item.price} onChange={e=>edit('price',e.target.value)} required/></label>
        <label>Material<input value={item.material} onChange={e=>edit('material',e.target.value)} required/></label>
      </div>
      <label>Descripción<textarea rows="3" value={item.description||''} onChange={e=>edit('description',e.target.value)}/></label>
      <label className="upload"><Upload size={17}/> {uploading?'Subiendo…':'Subir a Supabase Storage'}<input type="file" accept="image/*" multiple onChange={upload}/></label>
      {item.images.length>0&&<div className="images-gallery">
        <p className="gallery-label">{item.images.length} imagen{item.images.length!==1?'es':''}</p>
        <div className="gallery-grid">
          {item.images.map((img,idx)=><div key={idx} className="gallery-item">
            <img src={img} alt={`Imagen ${idx+1}`}/>
            <button type="button" className="remove-image" onClick={()=>removeImage(idx)}><X size={16}/></button>
          </div>)}
        </div>
      </div>}
      <button className="button" disabled={item.images.length===0}>Guardar producto <Check size={17}/></button>
    </form>
  </div>
}
