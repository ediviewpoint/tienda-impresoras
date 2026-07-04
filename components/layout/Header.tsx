'use client'

import Link from 'next/link'
import { useCartCount } from '@/lib/store/useStore'
import { FacturaToggle } from '@/components/ui/FacturaToggle'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function Header() {
  const count = useCartCount()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`/catalogo?q=${encodeURIComponent(q)}`)
      inputRef.current?.blur()
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 bg-[#1852D9] rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2h12v7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <rect x="2" y="9" width="20" height="9" rx="2" stroke="#fff" strokeWidth="2"/>
              <path d="M6 14v6h12v-6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="18" cy="13.5" r="1" fill="#fff"/>
            </svg>
          </div>
          <span className="text-xl font-extrabold text-gray-900">
            Print<span className="text-[#1852D9]">Max</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar impresoras, tóner, tinta…"
            className="w-full h-11 border-[1.5px] border-gray-200 rounded-full px-5 pr-12 text-sm bg-gray-50 outline-none focus:border-[#1852D9] placeholder:text-gray-400 transition-all"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#1852D9] rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          <Link href="/carrito" className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-[#1852D9] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[17px] h-[17px] bg-[#FF5722] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="h-10 px-3 rounded-full bg-blue-50 text-[#1852D9] text-sm font-semibold flex items-center gap-2 hover:bg-blue-100 transition-colors"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#1852D9] text-white text-xs flex items-center justify-center font-bold">
                    {(session.user?.name ?? session.user?.email ?? 'U')[0].toUpperCase()}
                  </span>
                )}
                {session.user?.name?.split(' ')[0] ?? 'Mi cuenta'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-xl shadow-lg w-44 py-1 z-50" onMouseLeave={() => setMenuOpen(false)}>
                  <Link href="/cuenta" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 font-semibold">Mi cuenta</Link>
                  <Link href="/cuenta/pedidos" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Mis pedidos</Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="h-10 px-4 rounded-full bg-blue-50 text-[#1852D9] text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Mi cuenta
            </Link>
          )}
        </div>
      </div>

      {/* Factura toggle bar */}
      <div className="bg-gradient-to-r from-[#1852D9] to-[#3B7BF8] px-6 py-2 flex items-center justify-end">
        <FacturaToggle />
      </div>
    </header>
  )
}
