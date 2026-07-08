'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderItem, Product } from '@/lib/generated/prisma/client'
import { STATUS_CLASSES } from '@/components/ui/OrderStatusBadge'

type FullOrder = Order & { items: (OrderItem & { product: Product })[] }

const STATUS_OPTIONS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado']

export default function AdminOrders() {
  const [orders, setOrders] = useState<FullOrder[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<FullOrder | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const url = filter ? `/api/ordenes?status=${filter}` : '/api/ordenes'
    const res = await fetch(url)
    const data = await res.json()
    setOrders(data.orders ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/ordenes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (res.ok) {
      setOrders(os => os.map(o => (o.id === id ? data.order : o)))
      if (selected?.id === id) setSelected(data.order)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Órdenes <span className="text-gray-400 font-normal text-lg">({total})</span>
        </h1>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando órdenes…</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">Sin órdenes.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                {['Número', 'Cliente', 'Total', 'Pago', 'Estado', 'Fecha', ''].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{o.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{o.clientName}</p>
                    <p className="text-xs text-gray-400">{o.clientEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(Number(o.total))}</td>
                  <td className="px-4 py-3 text-gray-500 capitalize">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={e => handleStatusChange(o.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_CLASSES[o.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(o)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail drawer */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-lg text-gray-900">Detalle de orden</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 font-semibold mb-1">Número de orden</p>
                <p className="font-mono">{selected.orderNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">Cliente</p>
                  <p className="font-semibold">{selected.clientName}</p>
                  <p className="text-gray-500">{selected.clientEmail}</p>
                  {selected.clientPhone && <p className="text-gray-500">{selected.clientPhone}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">Dirección</p>
                  <p className="text-gray-600">{selected.clientAddress ?? '—'}</p>
                  <p className="text-gray-600">{[selected.clientCity, selected.clientState, selected.clientZip].filter(Boolean).join(', ') || '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">Pago</p>
                  <p className="capitalize">{selected.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold mb-1">Factura</p>
                  <p>{selected.tieneFactura ? 'Con factura' : 'Sin factura'}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 font-semibold mb-2">Productos</p>
                <div className="space-y-2">
                  {selected.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-700">{item.product.name} ×{item.quantity}</span>
                      <span className="font-semibold">{formatPrice(Number(item.total))}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-1">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span><span>{formatPrice(Number(selected.subtotal))}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span><span>{Number(selected.shipping) === 0 ? 'GRATIS' : formatPrice(Number(selected.shipping))}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base pt-1">
                  <span>Total</span><span>{formatPrice(Number(selected.total))}</span>
                </div>
              </div>

              {selected.notes && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 font-semibold mb-1">Notas</p>
                  <p className="text-gray-600">{selected.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
