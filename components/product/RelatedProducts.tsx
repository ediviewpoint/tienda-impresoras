import { prisma } from '@/lib/db'
import { dbToUIProduct, PRODUCT_INCLUDE } from '@/lib/db-utils'
import { ProductGrid } from './ProductGrid'

interface Props {
  categoryId: string
  excludeSlug: string
}

export async function RelatedProducts({ categoryId, excludeSlug }: Props) {
  try {
    const raw = await prisma.product.findMany({
      where: { categoryId, active: true, NOT: { slug: excludeSlug } },
      include: PRODUCT_INCLUDE,
      take: 4,
      orderBy: { reviewCount: 'desc' },
    })
    if (raw.length === 0) return null

    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pb-12">
        <h2 className="text-xl font-extrabold text-gray-900 mb-5">
          Productos <span className="text-primary">relacionados</span>
        </h2>
        <ProductGrid products={raw.map(dbToUIProduct)} />
      </section>
    )
  } catch {
    return null
  }
}
