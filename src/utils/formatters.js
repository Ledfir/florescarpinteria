export const money = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n)

// La columna images puede llegar como array real (jsonb) o como string JSON (si la columna es text)
export const parseImages = val => {
  if(Array.isArray(val))return val
  if(typeof val==='string'&&val.trim()){
    try{const parsed=JSON.parse(val);return Array.isArray(parsed)?parsed:[]}catch{return []}
  }
  return []
}
