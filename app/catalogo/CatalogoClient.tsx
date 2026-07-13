'use client'

import { useState } from 'react'
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
  const [sheetOpen, setSheetOpen] = useState(false)

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
          className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-primary transition-all bg-white"
        />
      </div>

      {/* Mobile: Filtrar button */}
      <div className="lg:hidden flex items-center gap-2 mb-5">
        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filtrar
          {cat && (
            <span className="bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</span>
          )}
        </button>
        {cat && (
          <button
            onClick={() => setCat(null)}
            className="text-xs text-primary font-semibold hover:underline"
          >
            Limpiar
          </button>
        )}
        {cat && (
          <span className="text-xs text-gray-500 truncate">
            {categories.find(c => c.slug === cat)?.name}
          </span>
        )}
      </div>

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl shadow-2xl max-h-[75vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
              <h3 className="font-bold text-gray-900">Categoría</h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto px-4 py-3 space-y-1">
              <button
                onClick={() => { setCat(null); setSheetOpen(false) }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                  !cat ? 'bg-primary-light text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Todos <span className="text-gray-400 font-normal">({totalActive})</span>
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setCat(c.slug); setSheetOpen(false) }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors ${
                    cat === c.slug ? 'bg-primary-light text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {c.name} <span className="text-gray-400 font-normal">({c._count.products})</span>
                </button>
              ))}
            </div>
            <div className="px-4 py-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setSheetOpen(false)}
                className="w-full h-11 rounded-full bg-primary text-white font-bold text-sm"
              >
                Ver {allProducts.filter(p => !cat || p.category === cat).length} productos
              </button>
            </div>
          </div>
        </div>
      )}

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
