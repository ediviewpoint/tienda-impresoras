'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderItem, Product } from '@/lib/generated/prisma/client'
import { OrderStatusBadge } from '@/components/ui/OrderStatusBadge'

type FullOrder = Order & { items: (OrderItem & { product: Product })[] }

interface Props {
  user: { name: string; email: string; image: string | null }
  orders: FullOrder[]
}

type Tab = 'perfil' | 'pedidos'

export default function CuentaClient({ user, orders }: Props) {
  const [tab, setTab] = useState<Tab>('perfil')
  const [selectedOrder, setSelectedOrder] = useState<FullOrder | null>(null)

  return (
    <div className="max-w-5xl mx-auto px-6 mt-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-7">Mi cuenta</h1>

      <div className="grid grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-1">
          <div className="flex flex-col items-center py-5 border border-gray-100 rounded-xl bg-white mb-3">
            {user.image ? (
              <img src={user.image} alt="" className="w-16 h-16 rounded-full object-cover mb-2" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-extrabold flex items-center justify-center mb-2">
                {(user.name || user.email)[0].toUpperCase()}
              </div>
            )}
            <p className="font-bold text-gray-900 text-sm">{user.name || 'Usuario'}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          {([
            ['👤', 'Perfil', 'perfil'],
            ['📦', 'Mis pedidos', 'pedidos'],
          ] as const).map(([icon, label, id]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                tab === id ? 'bg-primary-light text-primary font-semibold' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{icon}</span>{label}
            </button>
          ))}

          <div className="pt-3">
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
            >
              <span>🚪</span> Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Perfil tab */}
        {tab === 'perfil' && (
          <div className="bg-white rounded-xl border border-gray-100 p-7">
            <h2 className="font-bold text-lg text-gray-900 mb-5">Información personal</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre</label>
                <input defaultValue={user.name} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
                <input defaultValue={user.email} disabled className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-5">El email no puede modificarse.</p>
          </div>
        )}

        {/* Pedidos tab */}
        {tab === 'pedidos' && (
          <div className="bg-white rounded-xl border border-gray-100 p-7">
            <h2 className="font-bold text-lg text-gray-900 mb-5">
              Mis pedidos <span className="text-gray-400 font-normal text-base">({orders.length})</span>
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p className="font-semibold">Aún no tienes pedidos</p>
                <a href="/catalogo" className="mt-4 inline-flex h-10 px-6 rounded-full bg-primary text-white text-sm font-bold items-center hover:bg-primary-dark transition-colors">
                  Ver catálogo
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-primary/30 hover:bg-primary-light/30 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-gray-400">{order.orderNumber}</p>
                        <p className="font-bold text-gray-900 mt-0.5">
                          {order.items.length} producto{order.items.length !== 1 ? 's' : ''} — {formatPrice(Number(order.total))}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    {selectedOrder?.id === order.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.product.name} ×{item.quantity}</span>
                            <span className="font-semibold">{formatPrice(Number(item.total))}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
                          <span>Pago: {order.paymentMethod}</span>
                          <span>{order.tieneFactura ? 'Con factura' : 'Sin factura'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
