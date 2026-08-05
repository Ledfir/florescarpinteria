import React from 'react'

export default function FloatingWhatsApp(){
  const whatsappNumber = '528124249620'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20gustaría%20consultar%20sobre%20los%20productos%20de%20Carpintería%20Flores`

  return <a 
    href={whatsappUrl} 
    target="_blank" 
    rel="noopener noreferrer"
    className="floating-whatsapp"
    title="Contactar por WhatsApp"
  >
    <img src="/whatsapp.svg" alt="WhatsApp"/>
  </a>
}
