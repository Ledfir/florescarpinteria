import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, LogOut, Plus, Search, Trash2 } from 'lucide-react'
import ProductModal from '../components/ProductModal'
import { supabase } from '../supabase'
import { money } from '../utils/formatters'

export default function Dashboard({products,setProducts,user,onLogout}){
  const [editing,setEditing]=useState(null)
  const [query,setQuery]=useState('')
  const [activeTab,setActiveTab]=useState('products')
  const [users,setUsers]=useState([])
  const [usersQuery,setUsersQuery]=useState('')
  
  React.useEffect(()=>{
    if(activeTab==='users'){
      fetchUsers()
    }
  },[activeTab])

  async function fetchUsers(){
  if(!supabase)return
  const {data,error}=await supabase.auth.admin.listUsers()
  if(error){
    console.error(error)
    alert('Error al cargar usuarios')
    return
  }
  setUsers(data?.users||[])
}

  const shown=products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase()))
  const shownUsers=users.filter(u=>u.email.toLowerCase().includes(usersQuery.toLowerCase()))

  async function remove(p){
    if(!confirm(`¿Eliminar ${p.name}?`))return
    if(supabase){
      const {error}=await supabase.from('products').delete().eq('id',p.id)
      if(error)return alert(error.message)
    }
    setProducts(x=>x.filter(item=>item.id!==p.id))
  }

  async function removeUser(u){
  if(!confirm(`¿Eliminar usuario ${u.email}?`))return
  if(supabase){
    const {error}=await supabase.auth.admin.deleteUser(u.id)
    if(error)return alert(error.message)
  }
  setUsers(x=>x.filter(item=>item.id!==u.id))
}

  return <main className="dashboard">
    <aside>
      <Link className="brand" to="/"><img src="/favicon.svg" alt="Logo" className="brand-logo"/><b>Carpinteria Flores</b></Link>
      <p className="user">{user.email}</p>
      <Link to="/">Ver sitio <ArrowRight size={16}/></Link>
      <button onClick={onLogout}><LogOut size={16}/> Cerrar sesión</button>
    </aside>
    <section className="admin-content">
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab==='products'?'active':''}`}
          onClick={()=>setActiveTab('products')}
        >
          Productos
        </button>
        <button 
          className={`tab-button ${activeTab==='users'?'active':''}`}
          onClick={()=>setActiveTab('users')}
        >
          Usuarios
        </button>
      </div>

      {activeTab==='products'&&(
        <>
          <div className="dash-title">
            <div>
              <p className="eyebrow">Administración</p>
              <h1>Productos</h1>
            </div>
            <button className="button" onClick={()=>setEditing({name:'',category:'Comedor',price:'',material:'',description:'',image_url:''})}><Plus size={18}/> Nuevo producto</button>
          </div>
          <div className="toolbar"><Search size={18}/><input placeholder="Buscar producto" value={query} onChange={e=>setQuery(e.target.value)}/><span>{products.length} piezas</span></div>
          <div className="admin-list">
            {shown.map(p=><article key={p.id}>
              <img src={p.images && p.images.length > 0 ? p.images[0] : p.image_url} alt=""/>
              <div><b>{p.name}</b><p>{p.category} · {p.material}</p></div>
              <strong>{money(p.price)}</strong>
              <button onClick={()=>setEditing(p)}>Editar</button>
              <button className="delete" onClick={()=>remove(p)}><Trash2 size={17}/></button>
            </article>)}
          </div>
        </>
      )}

      {activeTab==='users'&&(
        <>
          <div className="dash-title">
            <div>
              <p className="eyebrow">Administración</p>
              <h1>Usuarios</h1>
            </div>
          </div>
          <div className="toolbar"><Search size={18}/><input placeholder="Buscar usuario" value={usersQuery} onChange={e=>setUsersQuery(e.target.value)}/><span>{users.length} usuarios</span></div>
          <div className="admin-list">
            {shownUsers.length>0?shownUsers.map(u=><article key={u.id}>
              <div style={{width:'48px',height:'42px',background:'#666',borderRadius:'4px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',fontWeight:'bold'}}>
                {u.email.charAt(0).toUpperCase()}
              </div>
              <div><b>{u.email}</b><p>{u.created_at?new Date(u.created_at).toLocaleDateString('es-MX'):'N/A'}</p></div>
              <button className="delete" onClick={()=>removeUser(u)}><Trash2 size={17}/></button>
            </article>):<p style={{padding:'20px',color:'#999'}}>No hay usuarios registrados</p>}
          </div>
        </>
      )}
    </section>
    {editing&&<ProductModal product={editing} close={()=>setEditing(null)} save={async item=>{if(supabase){const {data,error}=item.id?await supabase.from('products').update(item).eq('id',item.id).select().single():await supabase.from('products').insert(item).select().single();if(error)return alert(error.message);item=data}setProducts(x=>item.id&&x.some(p=>p.id===item.id)?x.map(p=>p.id===item.id?item:p):[{...item,id:item.id||crypto.randomUUID()},...x]);setEditing(null)}}/>}
  </main>
}
