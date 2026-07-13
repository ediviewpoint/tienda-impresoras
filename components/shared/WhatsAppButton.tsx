"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  productName?: string;
  phoneNumber?: string; // Ejemplo: "59171234567"
}

export function WhatsAppButton({ 
  productName, 
  phoneNumber = "59171234567" 
}: WhatsAppButtonProps) {
  
  // Construye el mensaje según el contexto (si está viendo un producto o no)
  const defaultMessage = productName 
    ? `Hola ElitePC, estoy interesado en el producto: ${productName}. ¿Tienen disponibilidad?`
    : "Hola ElitePC, necesito asesoramiento sobre un equipo de impresión.";

  const encodedMessage = encodeURIComponent(defaultMessage);
  const waLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 hover:shadow-xl transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      
      {/* Tooltip on hover */}
      <span className="absolute right-16 px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ¿Necesitas ayuda? Escríbenos
      </span>
    </a>
  );
}
