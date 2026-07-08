import Link from 'next/link'
import { prisma } from '@/lib/db'
import { dbToUIProduct } from '@/lib/db-utils'
import { ProductGrid } from '@/components/product/ProductGrid'

export async function FeaturedProducts() {
  const dbProducts = await prisma.product.findMany({
    where: { active: true, inStock: true },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } },
    orderBy: { reviewCount: 'desc' },
    take: 4,
  })

  const products = dbProducts.map(dbToUIProduct)

  return (
    <section className="max-w-7xl mx-auto px-6 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Productos <span className="text-primary">destacados</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Selección de los más vendidos esta semana</p>
        </div>
        <Link href="/catalogo" className="text-sm font-semibold text-primary flex items-center gap-1 px-4 py-2 rounded-full hover:bg-primary-light transition-colors">
          Ver todos
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  )
}
