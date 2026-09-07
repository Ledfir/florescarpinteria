import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { supabase } from './supabase'
import Layout from './components/Layout'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProductDetail from './pages/ProductDetail'
import Model3D from './pages/Model3D'
import About from './pages/About'
import { sampleProducts } from './utils/sampleProducts'

export default function App(){
  const [user,setUser]=useState(null)
  const [products,setProducts]=useState(sampleProducts)
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    if(!supabase){setLoading(false);return}
    supabase.auth.getUser().then(({data})=>{setUser(data.user);setLoading(false)})
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user??null))
    return ()=>subscription.unsubscribe()
  },[])

  useEffect(()=>{
    if(!supabase)return
    supabase.from('products').select('*').order('created_at',{ascending:false}).then(({data,error})=>{
      if(!error&&data?.length){
        const normalized = data.map(p => ({
          ...p,
          images: Array.isArray(p.images) ? p.images : (p.image_url ? [p.image_url] : [])
        }))
        setProducts(normalized)
      }
    })
  },[])

  if(loading)return <div className="loader">Cargando Carpinteria Flores…</div>

  return <>
    <Routes>
      <Route path="/" element={<Layout user={user}><Home products={products}/></Layout>}/>
      <Route path="/catalogo" element={<Layout user={user}><Catalog products={products}/></Layout>}/>
      <Route path="/about" element={<Layout user={user}><About/></Layout>}/>
      <Route path="/producto/:id" element={<ProductDetail products={products}/>}/>
      <Route path="/modelo-3d/:modelId" element={<Layout user={user}><Model3D/></Layout>}/>
      <Route path="/contacto" element={<Layout user={user}><Contact/></Layout>}/>
      <Route path="/login" element={user?<Navigate to="/admin"/>:<Login onLogin={setUser}/>}/>
      <Route path="/admin" element={user?<Dashboard products={products} setProducts={setProducts} user={user} onLogout={()=>supabase?.auth.signOut()}/>:<Navigate to="/login"/>}/>
      <Route path="*" element={<Navigate to="/"/>}/>
    </Routes>
    <FloatingWhatsApp/>
  </>
}
