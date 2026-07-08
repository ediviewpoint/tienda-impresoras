'use client'

import { useQueryState } from 'nuqs'
import { ProductGrid } from '@/components/product/ProductGrid'
import type { Product } from '@/lib/types/index'

interface DbCategory {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface Props {
  allProducts: Product[]
  categories: DbCategory[]
  totalActive: number
  initialQ?: string
  initialCat?: string
}

export function CatalogoClient({ allProducts, categories, totalActive, initialQ, initialCat }: Props) {
  const [cat, setCat] = useQueryState('cat', { defaultValue: initialCat ?? '', shallow: false })
  const [q, setQ] = useQueryState('q', { defaultValue: initialQ ?? '', shallow: false })

  const filtered = allProducts.filter(p => {
    const matchesCat = !cat || p.category === cat
    const term = q.toLowerCase()
    const matchesQ = !term || p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term)
    return matchesCat && matchesQ
  })

  return (
    <div>
      {/* Search bar (inline, above grid) */}
      <div className="mb-5">
        <input
          value={q}
          onChange={e => setQ(e.target.value || null)}
          placeholder="Buscar por nombre o marca…"
          className="w-full h-10 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all bg-white"
        />
      </div>

      {/* Mobile category chips */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-5">
        <button
          onClick={() => setCat(null)}
          className={`flex-shrink-0 h-8 px-3 rounded-full text-sm font-semibold transition-colors ${
            !cat ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'
          }`}
        >
          Todos
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(cat === c.slug ? null : c.slug)}
            className={`flex-shrink-0 h-8 px-3 rounded-full text-sm font-semibold transition-colors ${
              cat === c.slug ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3">Categorías</h3>
            <ul className="space-y-0.5">
              <li>
                <button
                  onClick={() => setCat(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    !cat ? 'bg-primary-light text-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Todos
                  <span className="ml-1 text-xs text-gray-400">({totalActive})</span>
                </button>
              </li>
              {categories.map(c => (
                <li key={c.id}>
                  <button
                    onClick={() => setCat(cat === c.slug ? null : c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      cat === c.slug
                        ? 'bg-primary-light text-primary font-semibold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {c.name}
                    <span className="ml-1 text-xs text-gray-400">({c._count.products})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <p className="text-sm text-gray-400 mb-4">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
          </p>
          {filtered.length > 0 ? (
            <ProductGrid products={filtered} />
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold">No encontramos productos</p>
              <p className="text-sm mt-1">Intenta con otra búsqueda o categoría</p>
              <button
                onClick={() => { setCat(null); setQ(null) }}
                className="mt-4 text-sm text-primary font-semibold hover:underline"
              >
                Ver todos los productos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
