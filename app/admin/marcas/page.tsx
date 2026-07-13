import { prisma } from '@/lib/db'
import BrandsManager from '@/components/admin/BrandsManager'

export const dynamic = 'force-dynamic'

export default async function MarcasPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Marcas</h1>
      <BrandsManager brands={brands} />
    </div>
  )
}
