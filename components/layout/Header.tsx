'use client'

import Link from 'next/link'
import { useCartCount, useStore } from '@/lib/store/useStore'
import { FacturaToggle } from '@/components/ui/FacturaToggle'
import { useSession, signOut } from 'next-auth/react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function Header() {
  const count = useCartCount()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const setCartOpen = useStore(s => s.setCartOpen)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      router.push(`/catalogo?q=${encodeURIComponent(q)}`)
      inputRef.current?.blur()
      setMobileOpen(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 9V2h12v7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <rect x="2" y="9" width="20" height="9" rx="2" stroke="#fff" strokeWidth="2"/>
              <path d="M6 14v6h12v-6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="18" cy="13.5" r="1" fill="#fff"/>
            </svg>
          </div>
          <span className="text-xl font-extrabold text-gray-900">
            Print<span className="text-primary">Max</span>
          </span>
        </Link>

        {/* Search — desktop only */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar impresoras, tóner, tinta…"
            className="w-full h-11 border-[1.5px] border-gray-200 rounded-full px-5 pr-12 text-sm bg-gray-50 outline-none focus:border-primary placeholder:text-gray-400 transition-all"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Cart */}
          <button onClick={() => setCartOpen(true)} className="relative w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-primary-light hover:text-primary transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 w-[17px] h-[17px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Account button — desktop only */}
          {session ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="h-10 px-3 rounded-full bg-primary-light text-primary text-sm font-semibold flex items-center gap-2 hover:bg-primary-light/70 transition-colors"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
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
            <Link href="/auth/login" className="hidden md:flex h-10 px-4 rounded-full bg-primary-light text-primary text-sm font-semibold items-center gap-1.5 hover:bg-primary-light/70 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Mi cuenta
            </Link>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menú"
            className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Factura toggle bar */}
      <div className="bg-gradient-to-r from-primary to-primary-lighter px-6 py-2 flex items-center justify-end">
        <FacturaToggle />
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 shadow-md">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar impresoras, tóner, tinta…"
                className="w-full h-11 border-[1.5px] border-gray-200 rounded-full px-5 pr-12 text-sm bg-gray-50 outline-none focus:border-primary placeholder:text-gray-400 transition-all"
                autoFocus
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
            </div>
          </form>

          <nav className="flex flex-col gap-0.5">
            <Link href="/catalogo" onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Catálogo
            </Link>
            <button onClick={() => { setMobileOpen(false); setCartOpen(true); }}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
              Carrito
              {count > 0 && (
                <span className="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{count}</span>
              )}
            </button>
            {session ? (
              <>
                <Link href="/cuenta" onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Mi cuenta
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/' }) }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-error hover:bg-error-bg transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary-light transition-colors">
                Iniciar sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
