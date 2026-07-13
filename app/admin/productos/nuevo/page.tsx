import { prisma } from '@/lib/db'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function NuevoProductoPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Nuevo producto</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  )
}
