import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M6 9V2h12v7" stroke="#1852D9" strokeWidth="2" strokeLinecap="round"/>
          <rect x="2" y="9" width="20" height="9" rx="2" stroke="#1852D9" strokeWidth="2"/>
          <path d="M6 14v6h12v-6" stroke="#1852D9" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-6xl font-extrabold text-[#1852D9] mb-3">404</p>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Página no encontrada</h1>
      <p className="text-gray-500 mb-8 max-w-sm">
        Lo que buscas no existe o fue movido. Explora nuestro catálogo para encontrar lo que necesitas.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="h-11 px-6 rounded-full bg-[#1852D9] text-white font-bold text-sm hover:bg-blue-700 transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          href="/catalogo"
          className="h-11 px-6 rounded-full border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    </div>
  )
}
