import Link from 'next/link'

const footerLinks = {
  Productos: [
    ['Impresoras Láser', '/catalogo?cat=laser'],
    ['Impresoras Inkjet', '/catalogo?cat=inkjet'],
    ['Multifuncionales', '/catalogo?cat=multifuncional'],
    ['Impresoras 3D', '/catalogo?cat=3d'],
    ['Tinta y Tóner', '/catalogo?cat=toner'],
    ['Papel y Medios', '/catalogo?cat=papel'],
  ],
  'Mi cuenta': [
    ['Iniciar sesión', '/auth/login'],
    ['Registrarse', '/auth/register'],
    ['Mi cuenta', '/cuenta'],
    ['Devoluciones', '/devoluciones'],
  ],
  Información: [
    ['Sobre nosotros', '#'],
    ['Sucursales', '#'],
    ['Blog técnico', '#'],
    ['Preguntas frecuentes', '#'],
    ['Política de privacidad', '/privacidad'],
    ['Términos y condiciones', '/terminos'],
    ['Devoluciones', '/devoluciones'],
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0D1B4B] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-[2fr_1fr_1fr_1fr] gap-12 py-14">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M6 9V2h12v7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <rect x="2" y="9" width="20" height="9" rx="2" stroke="#fff" strokeWidth="2"/>
                <path d="M6 14v6h12v-6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="18" cy="13.5" r="1" fill="#fff"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold">Print<span className="text-blue-300">Max</span></span>
          </Link>
          <p className="text-sm text-white/55 leading-relaxed max-w-xs">
            Tu tienda especializada en impresoras, consumibles y accesorios en Bolivia.
          </p>
          <div className="flex gap-2 mt-5">
            {['FB', 'IG', 'YT', 'WA'].map(s => (
              <button key={s} className="w-9 h-9 rounded-full bg-white/10 text-white/70 text-xs font-bold hover:bg-primary hover:text-white transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.entries(footerLinks).map(([col, items]) => (
          <div key={col}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">{col}</h4>
            <ul className="space-y-2.5">
              {items.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/65 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-white/40">© 2025 PrintMax. Todos los derechos reservados.</p>
          <div className="flex gap-2">
            {['VISA', 'MC', 'PayPal', 'Transferencia', 'QR'].map(p => (
              <span key={p} className="h-6 px-2.5 bg-white/10 rounded text-[11px] font-bold text-white/60 flex items-center">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
