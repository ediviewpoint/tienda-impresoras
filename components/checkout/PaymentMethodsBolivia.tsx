"use client";

import * as React from "react";
import { QrCode, Building2, Wallet, CreditCard } from "lucide-react";

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const METODOS: PaymentMethod[] = [
  {
    id: "qr",
    title: "Pago Simple por QR",
    description: "Escanea el código QR desde tu app bancaria. Confirmación inmediata.",
    icon: QrCode,
  },
  {
    id: "transferencia",
    title: "Transferencia Bancaria",
    description: `Depósito directo a nuestra cuenta ${process.env.NEXT_PUBLIC_BANK_NAME ?? 'bancaria'}.`,
    icon: Building2,
  },
  {
    id: "efectivo",
    title: "Pago Contra Entrega",
    description: "Paga en efectivo al momento de recibir el producto (Solo Cochabamba).",
    icon: Wallet,
  },
  {
    id: "paypal",
    title: "Tarjeta de Crédito / PayPal",
    description: "Pago internacional seguro. Aplican comisiones.",
    icon: CreditCard,
  }
];

export function PaymentMethodsBolivia() {
  const [selectedMethod, setSelectedMethod] = React.useState<string>("qr");

  return (
    <div className="w-full">
      <h3 className="text-lg font-bold text-neutral-900 mb-4">Método de Pago</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {METODOS.map((method) => {
          const isSelected = selectedMethod === method.id;
          const Icon = method.icon;
          
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                isSelected 
                  ? "border-[#1852D9] bg-blue-50" 
                  : "border-neutral-200 hover:border-neutral-300 bg-white"
              }`}
            >
              <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                isSelected ? "border-[#1852D9]" : "border-neutral-300"
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#1852D9]" />}
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${isSelected ? "text-[#1852D9]" : "text-neutral-500"}`} />
                  <span className={`font-semibold ${isSelected ? "text-[#1852D9]" : "text-neutral-700"}`}>
                    {method.title}
                  </span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  {method.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Zona de Información Adicional según selección */}
      {selectedMethod === "qr" && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Aviso:</strong> El código QR se generará automáticamente en el siguiente paso de la compra. Tendrás 15 minutos para escanearlo.
        </div>
      )}
    </div>
  );
}
