'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/lib/generated/prisma/client'

interface Props {
  initialProducts: Product[]
}

const BADGE_OPTIONS = ['', 'new', 'sale', 'hot', 'best']
const CATEGORY_OPTIONS = ['laser', 'inkjet', 'multifuncional', '3d', 'toner', 'papel', 'accesorios']

type EditForm = Partial<Product> & { featuresText?: string }

export default function AdminProducts({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<EditForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('')

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.brand.toLowerCase().includes(filter.toLowerCase()) ||
    p.sku.toLowerCase().includes(filter.toLowerCase())
  )

  function openEdit(p: Product) {
    let featuresText = ''
    try {
      const arr = JSON.parse(p.features)
      featuresText = Array.isArray(arr) ? arr.join('\n') : p.features
    } catch {
      featuresText = p.features
    }
    setEditing({ ...p, featuresText })
  }

  async function handleSave() {
    if (!editing?.id) return
    setSaving(true)
    try {
      const features = (editing.featuresText ?? '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)

      const res = await fetch(`/api/productos/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editing, features }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProducts(ps => ps.map(p => (p.id === data.product.id ? data.product : p)))
      setEditing(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(p: Product) {
    const res = await fetch(`/api/productos/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !p.active }),
    })
    const data = await res.json()
    if (res.ok) setProducts(ps => ps.map(x => (x.id === p.id ? data.product : x)))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Productos</h1>
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Buscar producto…"
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#1852D9] w-56 transition-all"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
              {['Producto', 'SKU', 'Categoría', 'Precio', 'Stock', 'Activo', ''].map(h => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p.id} className={!p.active ? 'opacity-50' : ''}>
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.brand}</p>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold capitalize">{p.category}</span>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {p.inStock ? 'En stock' : 'Agotado'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${p.active ? 'bg-[#1852D9]' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.active ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-xs font-semibold text-[#1852D9] hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-gray-900 mb-5">Editar producto</h2>
            <div className="space-y-4">
              {[
                ['Nombre', 'name', 'text'],
                ['Precio', 'price', 'number'],
                ['Precio original', 'originalPrice', 'number'],
                ['Descripción', 'description', 'text'],
              ].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={String(editing[key as keyof EditForm] ?? '')}
                    onChange={e => setEditing(f => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#1852D9] transition-all"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Categoría</label>
                  <select
                    value={editing.category ?? ''}
                    onChange={e => setEditing(f => ({ ...f, category: e.target.value }))}
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#1852D9]"
                  >
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Badge</label>
                  <select
                    value={editing.badge ?? ''}
                    onChange={e => setEditing(f => ({ ...f, badge: e.target.value || null }))}
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-[#1852D9]"
                  >
                    {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || '(ninguno)'}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.inStock ?? true} onChange={e => setEditing(f => ({ ...f, inStock: e.target.checked }))} className="rounded" />
                  <span className="text-sm font-semibold text-gray-700">En stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing(f => ({ ...f, active: e.target.checked }))} className="rounded" />
                  <span className="text-sm font-semibold text-gray-700">Activo</span>
                </label>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Características (una por línea)</label>
                <textarea
                  value={editing.featuresText ?? ''}
                  onChange={e => setEditing(f => ({ ...f, featuresText: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1852D9] resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-11 rounded-full bg-[#1852D9] text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {saving ? 'Guardando…' : 'Guardar cambios'}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="h-11 px-6 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
