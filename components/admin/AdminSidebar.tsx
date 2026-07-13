'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingBag, Tag, Layers, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
  { href: '/admin/marcas', label: 'Marcas', icon: Layers },
]

function NavLinks({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-4 space-y-0.5 px-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100">
        <span className="text-lg font-extrabold text-gray-900">PrintMax</span>
        <span className="bg-primary text-white rounded-full text-xs px-2 py-0.5 font-semibold">Admin</span>
      </div>

      {/* Nav */}
      <NavLinks onClose={onClose} />

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Ver tienda
        </Link>
      </div>
    </div>
  )
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-white border-r border-gray-100 min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú"
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-base font-extrabold text-gray-900">PrintMax</span>
        <span className="bg-primary text-white rounded-full text-xs px-2 py-0.5 font-semibold">Admin</span>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60] flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-white h-full shadow-xl flex flex-col">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Cerrar menú"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
