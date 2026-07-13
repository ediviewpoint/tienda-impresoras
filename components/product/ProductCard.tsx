'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { AnimatedPrice } from '@/components/ui/AnimatedPrice'
import { useStore } from '@/lib/store/useStore'
import { useToastStore } from '@/lib/store/useToastStore'

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
}

function parseSpecs(features: string[], count = 2) {
  return features.slice(0, count).map(f => {
    const idx = f.indexOf(':')
    if (idx === -1) return { label: '', value: f.trim() }
    return { label: f.slice(0, idx).trim(), value: f.slice(idx + 1).trim() }
  }).filter(s => s.value)
}

const BADGE_MAP: Record<string, { text: string; cls: string }> = {
  new:  { text: 'Nuevo sellado', cls: 'bg-emerald-500 text-white' },
  sale: { text: 'Oferta',        cls: 'bg-accent text-white'      },
  hot:  { text: 'Más vendido',   cls: 'bg-orange-500 text-white'  },
  best: { text: 'Top ventas',    cls: 'bg-primary text-white'     },
}

export function ProductCard({ product }: { product: Product }) {
  const add = useStore(s => s.add)
  const push = useToastStore(s => s.push)
  const [added, setAdded]     = useState(false)
  const [imgError, setImgError] = useState(false)

  const color      = product.brandColor ?? '#1852D9'
  const outOfStock = !product.inStock || product.stock === 0
  const lowStock   = product.inStock && product.stock > 0 && product.stock <= 3
  const mainImage  = !imgError && product.images?.[0]
  const specs      = parseSpecs(product.features, 2)
  const badge      = !outOfStock && product.badge ? BADGE_MAP[product.badge] : null

  function handleAdd() {
    if (outOfStock) return
    add(product)
    push(`${product.name.substring(0, 30)}… agregado al carrito`)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <motion.article
      variants={cardVariants}
      whileHover={outOfStock ? {} : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300"
    >
      {/* ── Imagen ───────────────────────────────── */}
      <Link href={`/producto/${product.slug}`}>
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${color}14, ${color}06)` }}
        >
          {/* Overlay sin stock */}
          {outOfStock && (
            <div className="absolute inset-0 z-10 bg-white/65 flex items-center justify-center backdrop-blur-[1px]">
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-gray-800 text-white tracking-wide">
                Sin stock
              </span>
            </div>
          )}

          {/* Badge estado — esquina superior izquierda */}
          {badge && (
            <span className={`absolute top-2.5 left-2.5 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${badge.cls}`}>
              {badge.text}
            </span>
          )}

          {/* Últimas unidades — esquina superior derecha */}
          {lowStock && (
            <span className="absolute top-2.5 right-2.5 z-10 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white shadow-sm">
              ¡Últimas {product.stock}!
            </span>
          )}

          {/* Imagen con zoom en hover */}
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-contain p-5 transition-transform duration-300 group-hover:scale-106"
              onError={() => setImgError(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-106">
              <svg width="96" height="96" viewBox="0 0 120 120" fill="none">
                <rect x="15" y="40" width="90" height="50" rx="6" fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.3" strokeWidth="1.5"/>
                <rect x="25" y="20" width="70" height="24" rx="4" fill={color} fillOpacity="0.1" stroke={color} strokeOpacity="0.25" strokeWidth="1.5"/>
                <rect x="35" y="27" width="50" height="2.5" rx="1.25" fill={color} fillOpacity="0.4"/>
                <rect x="35" y="33" width="35" height="2.5" rx="1.25" fill={color} fillOpacity="0.3"/>
                <rect x="25" y="88" width="70" height="10" rx="3" fill={color} fillOpacity="0.12" stroke={color} strokeOpacity="0.2" strokeWidth="1.5"/>
                <circle cx="88" cy="60" r="5" fill={color} fillOpacity="0.4"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* ── Info ─────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Marca */}
        <p
          className="text-[10px] font-extrabold uppercase tracking-widest mb-1"
          style={{ color }}
        >
          {product.brand}
        </p>

        {/* Nombre — máximo 2 líneas */}
        <Link
          href={`/producto/${product.slug}`}
          className="text-sm font-bold text-gray-900 leading-snug mb-2.5 hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Spec mini-badges */}
        {specs.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {specs.map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ color, background: `${color}12`, border: `1px solid ${color}22` }}
                title={s.label || undefined}
              >
                {s.value}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Precio — protagonista */}
        <div className="mt-2">
          <AnimatedPrice basePrice={product.price} originalPrice={product.originalPrice} size="md" />
        </div>

        {/* Botón agregar */}
        <motion.button
          onClick={handleAdd}
          whileTap={outOfStock ? {} : { scale: 0.96 }}
          disabled={outOfStock}
          className={`mt-3 h-11 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-200 ${
            outOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : `opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${
                  added ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-dark'
                }`
          }`}
        >
          {outOfStock ? 'Sin stock' : added ? '✓ Agregado' : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Agregar al carrito
            </>
          )}
        </motion.button>
      </div>
    </motion.article>
  )
}
