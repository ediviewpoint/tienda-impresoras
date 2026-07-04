import { prisma } from '@/lib/db'
import { dbToUIProduct } from '@/lib/db-utils'
import { ProductGrid } from '@/components/product/ProductGrid'
import { categories } from '@/lib/data/products'

interface Props {
  searchParams: Promise<{ cat?: string; q?: string }>
}

export const dynamic = 'force-dynamic'

export default async function CatalogoPage({ searchParams }: Props) {
  const { cat, q } = await searchParams

  const dbProducts = await prisma.product.findMany({
    where: {
      active: true,
      ...(cat ? { category: cat } : {}),
      ...(q ? {
        OR: [
          { name: { contains: q } },
          { brand: { contains: q } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  const products = dbProducts.map(dbToUIProduct)

  // Recalculate counts from DB
  const allProducts = await prisma.product.findMany({ where: { active: true }, select: { category: true } })
  const countMap = allProducts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1
    return acc
  }, {})

  const currentCat = categories.find(c => c.id === cat)

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="mb-7">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {q
            ? `Resultados para "${q}"`
            : currentCat
            ? currentCat.label
            : 'Catálogo completo'}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Categorías</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="/catalogo"
                  className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                    !cat ? 'bg-blue-50 text-[#1852D9] font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Todos
                  <span className="ml-1 text-xs text-gray-400">({allProducts.length})</span>
                </a>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <a
                    href={`/catalogo?cat=${c.id}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      cat === c.id
                        ? 'bg-blue-50 text-[#1852D9] font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {c.label}
                    <span className="ml-1 text-xs text-gray-400">({countMap[c.id] ?? 0})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold">No encontramos productos</p>
              <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
              <a href="/catalogo" className="mt-4 inline-block text-sm text-[#1852D9] font-semibold hover:underline">
                Ver todos los productos
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
