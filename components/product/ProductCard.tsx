'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { AnimatedPrice } from '@/components/ui/AnimatedPrice'
import { useStore } from '@/lib/store/useStore'

export function ProductCard({ product }: { product: Product }) {
  const add = useStore(s => s.add)
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const outOfStock = !product.inStock || product.stock === 0
  const lowStock = product.inStock && product.stock > 0 && product.stock <= 5

  function handleAdd() {
    if (outOfStock) return
    add(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const mainImage = !imgError && product.images?.[0]

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group bg-white rounded-xl border-[1.5px] border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-200"
    >
      {/* Image area */}
      <div
        className="relative p-7 flex items-center justify-center min-h-[180px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${product.brandColor}18, ${product.brandColor}10)` }}
      >
        {product.badge && !outOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={product.badge} />
          </div>
        )}
        {outOfStock && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 uppercase tracking-wide">Agotado</span>
          </div>
        )}
        {lowStock && (
          <div className="absolute top-3 right-3 z-10">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">¡Últimas {product.stock}!</span>
          </div>
        )}
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            width={160}
            height={160}
            className="object-contain max-h-40 w-auto"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <svg width="110" height="110" viewBox="0 0 120 120" fill="none">
            <rect x="15" y="40" width="90" height="50" rx="6" fill={product.brandColor} fillOpacity="0.15" stroke={product.brandColor} strokeOpacity="0.3" strokeWidth="1.5"/>
            <rect x="25" y="20" width="70" height="24" rx="4" fill={product.brandColor} fillOpacity="0.1" stroke={product.brandColor} strokeOpacity="0.25" strokeWidth="1.5"/>
            <rect x="35" y="27" width="50" height="2.5" rx="1.25" fill={product.brandColor} fillOpacity="0.4"/>
            <rect x="35" y="33" width="35" height="2.5" rx="1.25" fill={product.brandColor} fillOpacity="0.3"/>
            <rect x="25" y="88" width="70" height="10" rx="3" fill={product.brandColor} fillOpacity="0.12" stroke={product.brandColor} strokeOpacity="0.2" strokeWidth="1.5"/>
            <rect x="40" y="82" width="40" height="8" rx="2" fill={product.brandColor} fillOpacity="0.25"/>
            <circle cx="88" cy="60" r="5" fill={product.brandColor} fillOpacity="0.4"/>
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: product.brandColor }}>
          {product.brand}
        </p>
        <Link
          href={`/producto/${product.slug}`}
          className="text-sm font-semibold text-gray-900 leading-snug mb-2 hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {product.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {product.features.slice(0, 3).map(f => (
              <span
                key={f}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                style={{ color: product.brandColor, background: `${product.brandColor}18` }}
              >
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="flex-1" />
        <StarRating rating={product.rating} count={product.reviewCount} />

        <div className="mt-3">
          <AnimatedPrice basePrice={product.price} originalPrice={product.originalPrice} size="md" />
        </div>

        <motion.button
          onClick={handleAdd}
          whileTap={outOfStock ? {} : { scale: 0.97 }}
          disabled={outOfStock}
          className={`mt-3.5 h-10 rounded-full text-sm font-bold flex items-center justify-center gap-2 transition-colors duration-200 ${
            outOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : `opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 ${added ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-dark'}`
          }`}
        >
          {outOfStock ? 'Sin stock' : added ? '✓ Agregado' : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Agregar al carrito
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
