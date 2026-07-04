import Link from 'next/link'

export function PromoBanners() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-2 gap-5">
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl px-10 py-9 flex items-center justify-between text-white relative overflow-hidden min-h-[180px]">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"/>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1.5">Oferta especial</p>
          <h3 className="text-2xl font-extrabold mb-1.5">Tóner HP 26A Original</h3>
          <p className="text-sm opacity-70 mb-5">Hasta 3,100 páginas. Máxima calidad garantizada.</p>
          <Link href="/catalogo?cat=toner"
            className="h-10 px-5 rounded-full bg-white text-gray-900 text-sm font-bold flex items-center gap-2 w-fit hover:opacity-90 transition-opacity">
            Ver oferta
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <span className="text-7xl opacity-30">🖨️</span>
      </div>

      <div className="bg-gradient-to-br from-red-900 to-red-500 rounded-2xl px-10 py-9 flex items-center justify-between text-white relative overflow-hidden min-h-[180px]">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5"/>
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1.5">Flash sale — 24 hrs</p>
          <h3 className="text-2xl font-extrabold mb-1.5">Resma de papel 500 hojas</h3>
          <p className="text-sm opacity-70 mb-5">Papel multipropósito 75gr — ideal para oficina.</p>
          <Link href="/catalogo?cat=papel"
            className="h-10 px-5 rounded-full bg-white text-gray-900 text-sm font-bold flex items-center gap-2 w-fit hover:opacity-90 transition-opacity">
            Comprar ahora
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        <span className="text-7xl opacity-30">📄</span>
      </div>
    </div>
  )
}
