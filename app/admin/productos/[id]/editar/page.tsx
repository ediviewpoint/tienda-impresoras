import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PRODUCT_INCLUDE } from '@/lib/db-utils'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Editar: {product.name}</h1>
      <ProductForm product={product} categories={categories} brands={brands} />
    </div>
  )
}
