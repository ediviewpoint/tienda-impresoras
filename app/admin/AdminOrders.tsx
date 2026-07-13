'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderItem, Product } from '@/lib/generated/prisma/client'
import { OrderStatusBadge } from '@/components/ui/OrderStatusBadge'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useToastStore } from '@/lib/store/useToastStore'

const AdminReceiptButton = dynamic(
  () => import('@/components/admin/AdminReceiptButton').then(m => m.AdminReceiptButton),
  { ssr: false, loading: () => null }
)

type FullOrder = Order & { items: (OrderItem & { product: Product })[] }

const STATUS_OPTIONS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado']
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

function buildClientWaUrl(order: FullOrder): string | null {
  const phone = (order.clientPhone ?? '').replace(/\D/g, '')
  if (!phone) return null
  const msg = encodeURIComponent(
    `Hola ${order.clientName}, te escribimos de PrintMax por tu pedido ${order.orderNumber}. ¿En qué te podemos ayudar?`
  )
  return `https://wa.me/${phone}?text=${msg}`
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<FullOrder[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<FullOrder | null>(null)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  const push = useToastStore(s => s.push)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const url = statusFilter ? `/api/ordenes?status=${statusFilter}` : '/api/ordenes'
    const res = await fetch(url)
    const data = await res.json()
    setOrders(data.orders ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = orders.filter(o => {
    if (!search) return true
    const q = search.toLowerCase()
    return o.orderNumber.toLowerCase().includes(q) || o.clientName.toLowerCase().includes(q)
  })

  async function applyStatusChange(id: string, status: string) {
    setStatusLoading(true)
    const res = await fetch(`/api/ordenes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    setStatusLoading(false)
    if (res.ok) {
      setOrders(os => os.map(o => (o.id === id ? data.order : o)))
      if (selected?.id === id) setSelected(data.order)
      push(`Estado actualizado: ${status}`)
    } else {
      push(data.error ?? 'Error al cambiar estado', 'error')
    }
  }

  function requestStatusChange(status: string) {
    if (!selected) return
    if (status === 'cancelado' && selected.status !== 'cancelado') {
      setPendingStatus(status)
      setConfirmCancelOpen(true)
    } else {
      applyStatusChange(selected.id, status)
    }
  }

  return (
    <div>
      {/* Header + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex-1 min-w-0">
          Órdenes <span className="text-gray-400 font-normal text-lg">({total})</span>
        </h1>
        <input
          type="text"
          placeholder="Buscar por número o cliente…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary w-56"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Cargando órdenes…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Sin órdenes{search ? ' que coincidan con la búsqueda' : ''}.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-semibold">Número</th>
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Pago</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800 truncate max-w-[140px]">{o.clientName}</p>
                    {o.clientPhone && <p className="text-xs text-gray-400">{o.clientPhone}</p>}
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatPrice(Number(o.total))}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(o)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Ver detalle
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
        <div
          className="fixed inset-0 bg-black/40 flex justify-end z-50"
          onClick={e => { if (e.target === e.currentTarget) setSelected(null) }}
        >
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Sticky header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-extrabold text-lg text-gray-900">Detalle de orden</h2>
                <p className="font-mono text-xs text-gray-400 mt-0.5">{selected.orderNumber}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-700 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-6 space-y-5 text-sm">
              {/* Client */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Cliente</p>
                  <p className="font-semibold text-gray-900">{selected.clientName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{selected.clientEmail}</p>
                  {selected.clientPhone && (
                    <p className="text-xs text-gray-500 mt-0.5">{selected.clientPhone}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dirección</p>
                  <p className="text-xs text-gray-600">{selected.clientAddress ?? '—'}</p>
                  <p className="text-xs text-gray-600">
                    {[selected.clientCity, selected.clientState, selected.clientZip].filter(Boolean).join(', ') || '—'}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Pago</p>
                  <p className="font-semibold text-xs capitalize">{selected.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Factura</p>
                  <p className="font-semibold text-xs">{selected.tieneFactura ? 'Con factura' : 'Sin factura'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Fecha</p>
                  <p className="font-semibold text-xs">{new Date(selected.createdAt).toLocaleDateString('es-BO')}</p>
                </div>
              </div>

              {/* Status change */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Estado</p>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={selected.status} />
                  <select
                    value={selected.status}
                    onChange={e => requestStatusChange(e.target.value)}
                    disabled={statusLoading}
                    className="h-8 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-primary flex-1 disabled:opacity-60 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Products */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Productos</p>
                <div className="space-y-2 bg-gray-50 rounded-xl p-3">
                  {selected.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-700 flex-1 pr-3">
                        {item.product.name}
                        <span className="text-gray-400 ml-1">×{item.quantity}</span>
                      </span>
                      <span className="font-semibold whitespace-nowrap">{formatPrice(Number(item.total))}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(Number(selected.subtotal))}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span>{Number(selected.shipping) === 0 ? 'GRATIS' : formatPrice(Number(selected.shipping))}</span>
                </div>
                <div className="flex justify-between font-extrabold text-base pt-1">
                  <span>Total</span>
                  <span>{formatPrice(Number(selected.total))}</span>
                </div>
              </div>

              {/* Notes */}
              {selected.notes && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Notas</p>
                  <p className="text-sm text-gray-700">{selected.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                {buildClientWaUrl(selected) && (
                  <a
                    href={buildClientWaUrl(selected)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-whatsapp text-white font-semibold text-sm hover:bg-whatsapp-dark transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.826L.057 23.985l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.032-1.378l-.361-.214-3.741.981 1-3.641-.235-.374A9.86 9.86 0 012.118 12C2.118 6.539 6.539 2.118 12 2.118c5.462 0 9.882 4.421 9.882 9.882 0 5.462-4.42 9.882-9.882 9.882z"/>
                    </svg>
                    Contactar por WhatsApp
                  </a>
                )}
                {!buildClientWaUrl(selected) && selected.clientPhone === null && WA_NUMBER && (
                  <p className="text-xs text-gray-400 text-center">El cliente no proporcionó teléfono.</p>
                )}
                <AdminReceiptButton order={selected} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel stock-restore warning */}
      <ConfirmDialog
        open={confirmCancelOpen}
        title="¿Cancelar esta orden?"
        message="Se restaurará el stock de todos los productos de esta orden. Esta acción no se puede deshacer."
        onConfirm={() => {
          setConfirmCancelOpen(false)
          if (pendingStatus && selected) {
            applyStatusChange(selected.id, pendingStatus)
          }
          setPendingStatus(null)
        }}
        onCancel={() => {
          setConfirmCancelOpen(false)
          setPendingStatus(null)
        }}
        loading={statusLoading}
        destructive
      />
    </div>
  )
}
