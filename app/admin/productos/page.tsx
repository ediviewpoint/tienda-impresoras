import Link from 'next/link'
import { prisma } from '@/lib/db'
import { PRODUCT_INCLUDE } from '@/lib/db-utils'
import ProductsTable from '@/components/admin/ProductsTable'

export const dynamic = 'force-dynamic'

export default async function ProductosPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <span>+</span> Nuevo producto
        </Link>
      </div>
      <ProductsTable products={products} categories={categories} />
    </div>
  )
}
