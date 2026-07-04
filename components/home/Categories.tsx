import Link from 'next/link'
import { categories } from '@/lib/data/products'

export function Categories() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Explora por <span className="text-primary">categoría</span>
          </h2>
          <p className="text-sm text-gray-400 mt-1">Encuentra exactamente lo que necesitas</p>
        </div>
        <Link href="/catalogo" className="text-sm font-semibold text-primary flex items-center gap-1 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors">
          Ver todas
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </div>

      <div className="grid grid-cols-6 gap-3.5">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/catalogo?cat=${cat.id}`}
            className="bg-white rounded-xl border-[1.5px] border-gray-100 px-4 py-6 flex flex-col items-center gap-3 text-center hover:border-primary hover:ring-4 hover:ring-primary/8 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: cat.bgColor }}
            >
              🖨️
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.count} productos</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
