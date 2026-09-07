import { jsPDF } from 'jspdf'

const INK = [44, 33, 25]
const COVER_BG = [26, 23, 20]
const PAPER = [247, 244, 238]
const GOLD = [199, 154, 86]
const MUTED = [118, 109, 100]
const LINE = [222, 216, 206]

const spaced = text => (text || '').toUpperCase().split('').join(' ')

async function loadImageAsDataUrl(url){
  try{
    const res = await fetch(url, { mode: 'cors' })
    const blob = await res.blob()
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }catch{
    return null
  }
}

function getImageSize(dataUrl){
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => resolve({ w: img.naturalWidth || 4, h: img.naturalHeight || 3 })
    img.onerror = () => resolve({ w: 4, h: 3 })
    img.src = dataUrl
  })
}

export async function generateCatalogPdf(products, { onProgress } = {}){
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 42

  // Portada
  doc.setFillColor(...COVER_BG)
  doc.rect(0, 0, pageW, pageH, 'F')
  doc.setDrawColor(58, 53, 47)
  doc.line(pageW / 2, margin, pageW / 2, pageH - margin)

  doc.setTextColor(190, 184, 174)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(spaced('Carpintería Flores'), margin, margin + 8)
  doc.text(spaced('Juarez, Nuevo León'), pageW - margin, margin + 8, { align: 'right' })

  doc.setTextColor(...GOLD)
  doc.setFontSize(10)
  doc.text(spaced('Catálogo de productos'), margin, pageH / 2 - 100)

  doc.setTextColor(...PAPER)
  doc.setFont('times', 'normal')
  doc.setFontSize(52)
  doc.text('Madera', margin, pageH / 2 - 30)

  doc.setTextColor(...GOLD)
  doc.setFont('times', 'italic')
  doc.text('maciza', margin, pageH / 2 + 40)

  doc.setTextColor(150, 145, 136)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const dateStr = new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })
  doc.text(dateStr, margin, pageH - margin)
  doc.text(spaced(`${products.length} piezas · construidas a mano`), pageW - margin, pageH - margin, { align: 'right' })

  const totalPages = products.length + 1

  for(let i = 0; i < products.length; i++){
    const p = products[i]
    doc.addPage()
    doc.setFillColor(...PAPER)
    doc.rect(0, 0, pageW, pageH, 'F')

    doc.setTextColor(...MUTED)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(spaced('Carpintería Flores — Catálogo'), margin, margin)
    doc.text(`${String(i + 2).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`, pageW - margin, margin, { align: 'right' })

    const imgUrl = (Array.isArray(p.images) && p.images[0]) || p.image_url
    const imgTop = margin + 24
    const imgMaxW = pageW - margin * 2
    const imgMaxH = 300

    if(imgUrl){
      const dataUrl = await loadImageAsDataUrl(imgUrl)
      if(dataUrl){
        const { w, h } = await getImageSize(dataUrl)
        const ratio = Math.min(imgMaxW / w, imgMaxH / h)
        const drawW = w * ratio
        const drawH = h * ratio
        const x = margin + (imgMaxW - drawW) / 2
        const format = dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
        try{ doc.addImage(dataUrl, format, x, imgTop, drawW, drawH) }catch{}
      }
    }

    let y = imgTop + imgMaxH + 46
    doc.setTextColor(...INK)
    doc.setFont('times', 'normal')
    doc.setFontSize(26)
    doc.text(p.name || '', margin, y)

    doc.setTextColor(...GOLD)
    doc.setFont('times', 'italic')
    doc.setFontSize(16)
    const priceText = `Desde $${Number(p.price || 0).toLocaleString('es-MX')} MXN`
    doc.text(priceText, pageW - margin, y, { align: 'right' })

    y += 18
    doc.setTextColor(...MUTED)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(spaced(`${p.category || ''} · ${p.material || ''}`), margin, y)

    y += 18
    doc.setDrawColor(...LINE)
    doc.line(margin, y, pageW - margin, y)

    y += 28
    doc.setTextColor(...INK)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    const descLines = doc.splitTextToSize(p.description || '', pageW - margin * 2)
    doc.text(descLines, margin, y)
    y += descLines.length * 14 + 26

    doc.setTextColor(...MUTED)
    doc.setFontSize(9)
    doc.text(spaced('Material'), margin, y)
    y += 18
    doc.setTextColor(...INK)
    doc.setFont('times', 'normal')
    doc.setFontSize(14)
    doc.text(p.material || '', margin, y)

    onProgress?.(i + 1, products.length)
  }

  doc.save('carpinteria-flores.pdf')
}
