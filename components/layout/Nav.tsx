'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',             label: 'Inicio' },
  { href: '/catalogo?cat=laser',         label: 'Impresoras Láser' },
  { href: '/catalogo?cat=inkjet',        label: 'Impresoras Inkjet' },
  { href: '/catalogo?cat=multifuncional',label: 'Multifuncionales' },
  { href: '/catalogo?cat=3d',            label: 'Impresión 3D' },
  { href: '/catalogo?cat=toner',         label: 'Tinta y Tóner' },
  { href: '/catalogo?cat=papel',         label: 'Papel y Medios' },
  { href: '/catalogo',                   label: 'Accesorios' },
  { href: '/catalogo?ofertas=1',         label: '🔥 Ofertas', hot: true },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
        {links.map(({ href, label, hot }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'px-4 py-3.5 text-[13.5px] font-medium whitespace-nowrap border-b-2 transition-colors duration-200',
              hot
                ? 'text-accent border-transparent hover:border-accent'
                : pathname === href
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent hover:text-primary hover:border-primary'
            )}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
