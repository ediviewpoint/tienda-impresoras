'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { AnimatedPrice } from '@/components/ui/AnimatedPrice'
import { ModelViewer3D } from '@/components/product/ModelViewer3D'
import { ProductGallery } from '@/components/product/ProductGallery'
import { useStore } from '@/lib/store/useStore'

export function ProductDetail({ product }: { product: Product }) {
  const add = useStore(s => s.add)
  const tieneFactura = useStore(s => s.tieneFactura)
  const [added, setAdded] = useState(false)
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<'images' | '3d'>('images')

  function handleAdd() {
    for (let i = 0; i < qty; i++) add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-8 grid grid-cols-2 gap-12">

        {/* Left — Image / 3D viewer */}
        <div>
          <div className="flex gap-2 mb-4">
            {(['images', '3d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-8 px-4 rounded-full text-xs font-semibold transition-colors ${
                  tab === t ? 'bg-[#1852D9] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {t === 'images' ? '📷 Imágenes' : '🧊 Vista 3D'}
              </button>
            ))}
          </div>

          {tab === 'images' ? (
            product.images.length > 0 ? (
              <ProductGallery images={product.images} alt={product.name} />
            ) : (
              <div
                className="rounded-xl flex items-center justify-center min-h-[360px]"
                style={{ background: `linear-gradient(135deg, ${product.brandColor}15, ${product.brandColor}08)` }}
              >
                <svg width="220" height="220" viewBox="0 0 120 120" fill="none">
                  <rect x="15" y="40" width="90" height="50" rx="6" fill={product.brandColor} fillOpacity="0.2" stroke={product.brandColor} strokeOpacity="0.35" strokeWidth="1.5"/>
                  <rect x="25" y="20" width="70" height="24" rx="4" fill={product.brandColor} fillOpacity="0.12" stroke={product.brandColor} strokeOpacity="0.3" strokeWidth="1.5"/>
                  <rect x="35" y="27" width="50" height="2.5" rx="1.25" fill={product.brandColor} fillOpacity="0.5"/>
                  <rect x="35" y="33" width="35" height="2.5" rx="1.25" fill={product.brandColor} fillOpacity="0.35"/>
                  <rect x="25" y="88" width="70" height="10" rx="3" fill={product.brandColor} fillOpacity="0.15" stroke={product.brandColor} strokeOpacity="0.25" strokeWidth="1.5"/>
                  <rect x="40" y="82" width="40" height="8" rx="2" fill={product.brandColor} fillOpacity="0.3"/>
                  <circle cx="88" cy="60" r="5" fill={product.brandColor} fillOpacity="0.45"/>
                </svg>
              </div>
            )
          ) : (
            <ModelViewer3D src="" alt={product.name} />
          )}
        </div>

        {/* Right — Info */}
        <div className="flex flex-col">
          {product.badge && (
            <div className="mb-3"><Badge variant={product.badge} /></div>
          )}
          <p className="text-sm font-bold uppercase tracking-wider mb-1.5" style={{ color: product.brandColor }}>
            {product.brand} · SKU: {product.sku}
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-snug mb-3">{product.name}</h1>
          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="mt-4">
            <AnimatedPrice basePrice={product.price} originalPrice={product.originalPrice} size="lg" />
            <p className="text-xs text-gray-400 mt-1">
              Precio {tieneFactura ? 'con IVA incluido (C/F)' : 'sin IVA (S/F)'}
            </p>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mt-4 mb-5">{product.description}</p>

          <ul className="space-y-2 mb-6">
            {product.features.map(f => (
              <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-4 h-4 rounded-full bg-blue-50 text-[#1852D9] flex items-center justify-center text-[10px] font-bold">✓</span>
                {f}
              </li>
            ))}
          </ul>

          {/* Qty + cart */}
          <div className="flex items-center gap-3 mt-auto">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-lg">−</button>
              <span className="w-10 text-center font-bold text-sm">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-10 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-lg">+</button>
            </div>
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 h-11 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                added ? 'bg-emerald-500 text-white' : 'bg-[#1852D9] text-white hover:bg-[#1340B0]'
              }`}
            >
              {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </motion.button>
          </div>

          {/* Share */}
          <div className="flex gap-2 mt-4">
            <p className="text-xs text-gray-400 self-center">Compartir:</p>
            {[
              { label: 'WhatsApp', color: '#25D366', href: `https://wa.me/?text=${encodeURIComponent(product.name + ' — PrintMax')}` },
              { label: 'Facebook', color: '#1877F2', href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://printmax.bo'}/producto/` + product.slug)}` },
            ].map(({ label, color, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-full text-white text-[11px] font-bold flex items-center transition-opacity hover:opacity-85"
                style={{ background: color }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Related suggestion */}
      <div className="mt-4 text-center">
        <a href="/catalogo" className="text-sm text-gray-400 hover:text-[#1852D9] transition-colors">
          ← Volver al catálogo
        </a>
      </div>
    </div>
  )
}
