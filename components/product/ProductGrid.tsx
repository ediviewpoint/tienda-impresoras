'use client'

import { motion } from 'framer-motion'
import { Product } from '@/lib/types'
import { ProductCard } from './ProductCard'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </motion.div>
  )
}
