'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store/useStore'
import { formatPrice, discountPercent } from '@/lib/utils'

interface AnimatedPriceProps {
  basePrice: number
  originalPrice?: number
  size?: 'sm' | 'md' | 'lg'
}

export function AnimatedPrice({ basePrice, originalPrice, size = 'md' }: AnimatedPriceProps) {
  const getPrecio = useStore(s => s.getPrecio)
  const tieneFactura = useStore(s => s.tieneFactura)

  const finalPrice = getPrecio(basePrice)
  const finalOriginal = originalPrice ? getPrecio(originalPrice) : undefined
  const discount = finalOriginal ? discountPercent(finalPrice, finalOriginal) : 0

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-4xl',
  }

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <AnimatePresence mode="wait">
        <motion.span
          key={`${finalPrice}-${tieneFactura}`}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className={`font-extrabold text-gray-900 ${textSizes[size]}`}
        >
          {formatPrice(finalPrice)}
        </motion.span>
      </AnimatePresence>

      {finalOriginal && (
        <AnimatePresence mode="wait">
          <motion.span
            key={`orig-${finalOriginal}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-400 line-through"
          >
            {formatPrice(finalOriginal)}
          </motion.span>
        </AnimatePresence>
      )}

      {discount > 0 && (
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
          -{discount}%
        </span>
      )}
    </div>
  )
}
