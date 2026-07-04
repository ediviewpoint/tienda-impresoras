import { brands } from '@/lib/data/products'

export function Brands() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900">
          Marcas <span className="text-primary">oficiales</span>
        </h2>
        <p className="text-sm text-gray-400 mt-1">Distribuidor autorizado de las mejores marcas</p>
      </div>
      <div className="flex gap-4 flex-wrap">
        {brands.map(brand => (
          <button
            key={brand}
            className="flex-1 min-w-[120px] h-[72px] bg-white border-[1.5px] border-gray-100 rounded-xl font-extrabold text-gray-400 text-base hover:border-primary hover:text-primary hover:ring-4 hover:ring-primary/8 transition-all duration-200"
          >
            {brand}
          </button>
        ))}
      </div>
    </section>
  )
}
