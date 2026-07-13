import { prisma } from '@/lib/db'
import { dbToUIProduct, PRODUCT_INCLUDE } from '@/lib/db-utils'
import { CatalogoClient } from './CatalogoClient'

interface Props {
  searchParams: Promise<{ cat?: string; q?: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }: Props) {
  const { cat, q } = await searchParams
  const title = q
    ? `"${q}" — Catálogo`
    : cat
    ? `${cat.charAt(0).toUpperCase() + cat.slice(1)} — Catálogo`
    : 'Catálogo completo'
  return { title }
}

export default async function CatalogoPage({ searchParams }: Props) {
  const [{ cat: initialCat, q: initialQ }, dbProducts, dbCategories, totalActive] = await Promise.all([
    searchParams,
    prisma.product.findMany({
      where: { active: true },
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: { where: { active: true } } } } },
      orderBy: { name: 'asc' },
    }),
    prisma.product.count({ where: { active: true } }),
  ])

  const products = dbProducts.map(dbToUIProduct)

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-gray-900">Catálogo</h1>
        <p className="text-sm text-gray-400 mt-1">Explora nuestra selección completa de impresoras y accesorios</p>
      </div>
      <CatalogoClient
        allProducts={products}
        categories={dbCategories}
        totalActive={totalActive}
        initialQ={initialQ}
        initialCat={initialCat}
      />
    </div>
  )
}
