'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore, useCartTotal } from '@/lib/store/useStore'
import { formatPrice } from '@/lib/utils'
import { AnimatedPrice } from '@/components/ui/AnimatedPrice'

export default function CarritoPage() {
  const items = useStore(s => s.items)
  const remove = useStore(s => s.remove)
  const updateQty = useStore(s => s.updateQty)
  const total = useCartTotal()
  const shipping = total >= 800 ? 0 : 150
  const tieneFactura = useStore(s => s.tieneFactura)

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 mt-16 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-400 mb-6">Agrega productos para continuar.</p>
        <Link href="/catalogo" className="inline-flex h-11 px-8 rounded-full bg-[#1852D9] text-white font-bold text-sm items-center gap-2 hover:bg-[#1340B0] transition-colors">
          Explorar catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-7">Tu carrito</h1>

      <div className="grid grid-cols-[1fr_360px] gap-8">
        {/* Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-5"
              >
                <div
                  className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${product.brandColor}18` }}
                >
                  <svg width="48" height="48" viewBox="0 0 120 120" fill="none">
                    <rect x="15" y="40" width="90" height="50" rx="6" fill={product.brandColor} fillOpacity="0.25"/>
                    <rect x="25" y="20" width="70" height="24" rx="4" fill={product.brandColor} fillOpacity="0.15"/>
                  </svg>
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: product.brandColor }}>{product.brand}</p>
                  <p className="font-semibold text-gray-900 text-sm leading-snug">{product.name}</p>
                  <div className="mt-1">
                    <AnimatedPrice basePrice={product.price} size="sm" />
                  </div>
                </div>

                <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button onClick={() => updateQty(product.id, quantity - 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold">−</button>
                  <span className="w-8 text-center font-bold text-sm">{quantity}</span>
                  <button onClick={() => updateQty(product.id, quantity + 1)} className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold">+</button>
                </div>

                <AnimatedPrice basePrice={product.price * quantity} size="sm" />

                <button onClick={() => remove(product.id)} className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit">
          <h3 className="font-extrabold text-lg text-gray-900 mb-5">Resumen del pedido</h3>
          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} artículos)</span>
              <AnimatePresence mode="wait">
                <motion.span key={total} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold">
                  {formatPrice(total)}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>{shipping === 0 ? 'GRATIS' : formatPrice(shipping)}</span>
            </div>
            <p className="text-xs text-gray-400">{tieneFactura ? 'Con factura — IVA incluido' : 'Sin factura — precio neto'}</p>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-gray-900 text-base">
              <span>Total</span>
              <AnimatePresence mode="wait">
                <motion.span key={total + shipping} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                  {formatPrice(total + shipping)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <Link href="/checkout" className="w-full h-12 rounded-full bg-[#1852D9] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1340B0] transition-colors">
            Proceder al pago
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <Link href="/catalogo" className="mt-3 w-full h-10 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
