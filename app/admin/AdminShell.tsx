'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import type { Brand, Category, Product, ProductImage, Order, OrderItem } from '@/lib/generated/prisma/client'
import AdminProducts from './AdminProducts'
import AdminOrders from './AdminOrders'

type RecentOrder = Order & { items: OrderItem[] }
type FullProduct = Product & { brand: Brand; category: Category; images: ProductImage[] }

interface Stats {
  products: number
  orders: number
  revenue: number
  recentOrders: RecentOrder[]
}

interface Props {
  stats: Stats
  initialProducts: FullProduct[]
}

type Tab = 'dashboard' | 'productos' | 'ordenes'

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'productos', label: 'Productos', icon: '🖨️' },
  { id: 'ordenes', label: 'Órdenes', icon: '📦' },
]

const STATUS_COLORS: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-red-100 text-red-700',
}

export default function AdminShell({ stats, initialProducts }: Props) {
  const [tab, setTab] = useState<Tab>('dashboard')

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col pt-8 px-4 gap-1">
        <div className="px-2 mb-6">
          <span className="text-lg font-extrabold text-gray-900">PrintMax</span>
          <span className="ml-2 text-xs bg-[#1852D9] text-white px-2 py-0.5 rounded-full font-semibold">Admin</span>
        </div>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors text-left ${
              tab === n.id ? 'bg-[#1852D9] text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{n.icon}</span>
            {n.label}
          </button>
        ))}
        <div className="mt-auto pb-6">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <span>←</span> Ver tienda
          </a>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {tab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Dashboard</h1>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Productos activos', value: stats.products, color: '#1852D9', icon: '🖨️' },
                { label: 'Órdenes totales', value: stats.orders, color: '#7C3AED', icon: '📦' },
                { label: 'Ingresos totales', value: formatPrice(stats.revenue), color: '#16A34A', icon: '💰' },
              ].map(({ label, value, color, icon }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4">
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Órdenes recientes</h2>
              {stats.recentOrders.length === 0 ? (
                <p className="text-gray-400 text-sm">Sin órdenes aún.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                      <th className="pb-2 font-semibold">Número</th>
                      <th className="pb-2 font-semibold">Cliente</th>
                      <th className="pb-2 font-semibold">Items</th>
                      <th className="pb-2 font-semibold">Total</th>
                      <th className="pb-2 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {stats.recentOrders.map(o => (
                      <tr key={o.id}>
                        <td className="py-2.5 font-mono text-xs text-gray-500">{o.orderNumber}</td>
                        <td className="py-2.5 text-gray-700">{o.clientName}</td>
                        <td className="py-2.5 text-gray-500">{o.items.length} producto{o.items.length !== 1 ? 's' : ''}</td>
                        <td className="py-2.5 font-semibold">{formatPrice(Number(o.total))}</td>
                        <td className="py-2.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-600'}`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'productos' && <AdminProducts initialProducts={initialProducts} />}
        {tab === 'ordenes' && <AdminOrders />}
      </main>
    </div>
  )
}
