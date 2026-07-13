import { prisma } from '@/lib/db'
import CategoriesManager from '@/components/admin/CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Categorías</h1>
      <CategoriesManager categories={categories} />
    </div>
  )
}
