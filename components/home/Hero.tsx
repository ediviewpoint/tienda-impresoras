import Link from 'next/link'

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-7 grid grid-cols-[1fr_340px] gap-5">
      {/* Main banner */}
      <div className="relative bg-gradient-to-br from-[#0D2A8F] via-[#1852D9] to-[#3B7BF8] rounded-2xl p-12 flex items-center justify-between overflow-hidden min-h-[340px]">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-[-30px] right-[-30px] w-72 h-72 rounded-full bg-white"/>
          <div className="absolute bottom-[-40px] right-[-20px] w-56 h-56 rounded-full bg-white"/>
        </div>

        <div className="relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
            Nuevo lanzamiento 2025
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
            La impresora que <span className="text-blue-300">tu empresa</span> necesita
          </h1>
          <p className="text-white/75 text-sm leading-relaxed mb-8">
            HP LaserJet Pro 4001dn — Velocidad profesional, calidad premium y conectividad total.
          </p>
          <div className="flex gap-3">
            <Link href="/producto/hp-laserjet-pro-4001dn"
              className="h-11 px-7 rounded-full bg-accent text-white text-sm font-bold flex items-center gap-2 shadow-[0_4px_16px_rgba(255,87,34,.4)] hover:bg-accent-dark hover:-translate-y-px transition-all">
              Ver producto
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/catalogo"
              className="h-11 px-6 rounded-full border border-white/25 bg-white/10 text-white text-sm font-semibold flex items-center gap-2 hover:bg-white/20 transition-colors">
              Ver catálogo
            </Link>
          </div>
        </div>

        {/* Printer illustration */}
        <div className="relative flex-shrink-0">
          <svg width="220" height="200" viewBox="0 0 260 220" fill="none" className="drop-shadow-2xl">
            <rect x="30" y="80" width="200" height="90" rx="10" fill="white" fillOpacity="0.18"/>
            <rect x="30" y="80" width="200" height="90" rx="10" stroke="white" strokeOpacity="0.35" strokeWidth="1.5"/>
            <rect x="60" y="40" width="140" height="44" rx="7" fill="white" fillOpacity="0.14"/>
            <rect x="60" y="40" width="140" height="44" rx="7" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
            <rect x="75" y="50" width="110" height="4" rx="2" fill="white" fillOpacity="0.5"/>
            <rect x="75" y="58" width="110" height="4" rx="2" fill="white" fillOpacity="0.4"/>
            <rect x="75" y="66" width="110" height="4" rx="2" fill="white" fillOpacity="0.3"/>
            <circle cx="185" cy="108" r="10" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
            <circle cx="185" cy="108" r="4" fill="white" fillOpacity="0.6"/>
            <rect x="148" y="103" width="22" height="10" rx="4" fill="white" fillOpacity="0.2"/>
            <rect x="90" y="98" width="48" height="22" rx="5" fill="white" fillOpacity="0.2"/>
            <rect x="95" y="104" width="28" height="4" rx="2" fill="white" fillOpacity="0.6"/>
            <rect x="95" y="111" width="20" height="3" rx="1.5" fill="white" fillOpacity="0.35"/>
            <rect x="50" y="168" width="160" height="14" rx="4" fill="white" fillOpacity="0.12"/>
            <rect x="80" y="162" width="100" height="8" rx="2" fill="white" fillOpacity="0.5"/>
          </svg>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-primary text-xs font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-lg">
            desde $4,299 MXN
          </div>
        </div>
      </div>

      {/* Side cards */}
      <div className="flex flex-col gap-4">
        <Link href="/catalogo?cat=toner"
          className="flex-1 bg-gradient-to-br from-teal-700 to-teal-400 rounded-xl p-6 flex items-center gap-4 text-white hover:-translate-y-0.5 hover:shadow-xl transition-all relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-30%</div>
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 text-2xl">🖨️</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Categoría</p>
            <p className="font-bold text-base">Cartuchos de Tinta</p>
            <p className="text-xs opacity-75">Compatibles y originales</p>
          </div>
        </Link>
        <Link href="/catalogo?cat=3d"
          className="flex-1 bg-gradient-to-br from-violet-700 to-violet-400 rounded-xl p-6 flex items-center gap-4 text-white hover:-translate-y-0.5 hover:shadow-xl transition-all relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-white text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full">NUEVO</div>
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 text-2xl">🧊</div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Impresoras 3D</p>
            <p className="font-bold text-base">Creality & Bambu Lab</p>
            <p className="text-xs opacity-75">Impresión de próxima gen</p>
          </div>
        </Link>
      </div>
    </section>
  )
}
