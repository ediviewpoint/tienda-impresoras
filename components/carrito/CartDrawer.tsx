"use client";

import * as React from "react";
import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/formatters";
import { useStore, useCartTotal } from "@/lib/store/useStore";
import Image from "next/image";

export function CartDrawer() {
  const isOpen = useStore((s) => s.isCartOpen);
  const onClose = () => useStore.getState().setCartOpen(false);
  const items = useStore((s) => s.items);
  const remove = useStore((s) => s.remove);
  const updateQty = useStore((s) => s.updateQty);
  const getPrecio = useStore((s) => s.getPrecio);
  const total = useCartTotal();

  // Previene el scroll del body cuando el carrito está abierto
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro (Overlay) */}
      <div 
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel del Carrito */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 text-neutral-900">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="text-lg font-bold">Tu Carrito ({items.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-4">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <div className="relative w-20 h-20 bg-white rounded-lg border border-neutral-200 flex-shrink-0 overflow-hidden">
                  <Image 
                    src={item.product.images[0] || "/placeholder.png"}
                    alt={item.product.name} 
                    fill 
                    className="object-contain p-2" 
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-sm font-medium text-neutral-800 line-clamp-2">{item.product.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-[#1852D9]">{formatCurrency(getPrecio(item.product.price))}</span>
                    <div className="flex items-center gap-3">
                      <select 
                        value={item.quantity}
                        onChange={(e) => updateQty(item.product.id, Number(e.target.value))}
                        className="text-xs border border-neutral-200 rounded p-1"
                      >
                        {[1, 2, 3, 4, 5, 10].map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => remove(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer (Resumen y Checkout) */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-500">Subtotal</span>
              <span className="text-xl font-bold text-neutral-900">{formatCurrency(total)}</span>
            </div>
            <Link 
              href="/checkout"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-[#1852D9] text-white py-4 rounded-xl font-bold hover:bg-[#1340B0] transition-colors"
            >
              Proceder al Pago
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
