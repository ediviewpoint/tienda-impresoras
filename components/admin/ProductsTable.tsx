'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Brand, Category, Product, ProductImage } from '@/lib/generated/prisma/client'
import { useToastStore } from '@/lib/store/useToastStore'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { formatPrice } from '@/lib/utils'

type FullProduct = Product & { brand: Brand; category: Category; images: ProductImage[] }

interface Props {
  products: FullProduct[]
  categories: Pick<Category, 'id' | 'name' | 'slug'>[]
}

export default function ProductsTable({ products: initialProducts, categories }: Props) {
  const [products, setProducts] = useState<FullProduct[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [editingStock, setEditingStock] = useState<{ id: string; value: string } | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const push = useToastStore(s => s.push)

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    const matchesCat = !catFilter || p.category.slug === catFilter
    return matchesSearch && matchesCat
  })

  async function saveStock(id: string, value: string) {
    const stock = parseInt(value, 10)
    if (isNaN(stock) || stock < 0) {
      setEditingStock(null)
      return
    }
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock }),
    })
    if (res.ok) {
      setProducts(ps => ps.map(p => p.id === id ? { ...p, stock } : p))
      push('Stock actualizado')
    } else {
      push('Error al actualizar stock', 'error')
    }
    setEditingStock(null)
  }

  async function toggleActive(id: string, current: boolean) {
    const res = await fetch(`/api/productos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !current }),
    })
    if (res.ok) {
      setProducts(ps => ps.map(p => p.id === id ? { ...p, active: !current } : p))
      push(current ? 'Producto desactivado' : 'Producto activado')
    } else {
      push('Error al cambiar estado', 'error')
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setDeleteLoading(true)
    const { id, name } = deleting
    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    const data = await res.json().catch(() => ({}))
    setDeleteLoading(false)
    setDeleting(null)
    if (res.ok) {
      setProducts(ps => ps.filter(p => p.id !== id))
      push(`"${name}" eliminado`)
    } else if (res.status === 409) {
      push('No se puede eliminar: el producto tiene órdenes históricas. Desactivalo en su lugar.', 'error')
    } else {
      push((data as { error?: string }).error ?? 'Error al eliminar', 'error')
    }
  }

  function getStockStatus(p: FullProduct): { label: string; cls: string } {
    if (p.stock === 0) return { label: 'Agotado', cls: 'bg-red-100 text-red-700' }
    if (p.stock <= 3) return { label: 'Stock bajo', cls: 'bg-amber-100 text-amber-700' }
    return { label: 'En stock', cls: 'bg-green-100 text-green-700' }
  }

  const sortedImages = (p: FullProduct) =>
    [...p.images].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o SKU…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary flex-1 min-w-[200px]"
        />
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Categoría</th>
              <th className="px-4 py-3 font-semibold">Precio</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Estado</th>
              <th className="px-4 py-3 font-semibold">Activo</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  Sin productos{search || catFilter ? ' que coincidan con el filtro' : ''}.
                </td>
              </tr>
            ) : (
              filtered.map(p => {
                const thumb = sortedImages(p)[0]?.url ?? null
                const stockStatus = getStockStatus(p)
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    {/* Miniatura + nombre */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt={p.name}
                              width={36}
                              height={36}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.brand.name} · {p.sku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Categoría */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                        {p.category.name}
                      </span>
                    </td>

                    {/* Precio */}
                    <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                      {formatPrice(Number(p.price))}
                    </td>

                    {/* Stock (inline edit) */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {editingStock?.id === p.id ? (
                          <input
                            type="number"
                            min={0}
                            autoFocus
                            value={editingStock.value}
                            onChange={e => setEditingStock({ id: p.id, value: e.target.value })}
                            onBlur={() => saveStock(p.id, editingStock.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') saveStock(p.id, editingStock.value)
                              if (e.key === 'Escape') setEditingStock(null)
                            }}
                            className="w-16 h-7 border border-primary rounded px-2 text-sm outline-none"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingStock({ id: p.id, value: String(p.stock) })}
                            className="font-semibold text-gray-800 hover:text-primary hover:underline tabular-nums"
                          >
                            {p.stock}
                          </button>
                        )}
                        {p.stock <= 3 && p.stock > 0 && (
                          <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                            ¡Bajo!
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Estado de stock */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stockStatus.cls}`}>
                        {stockStatus.label}
                      </span>
                    </td>

                    {/* Toggle activo */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(p.id, p.active)}
                        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${
                          p.active ? 'bg-primary' : 'bg-gray-200'
                        }`}
                        aria-label={p.active ? 'Desactivar' : 'Activar'}
                      >
                        <span
                          className={`inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform ${
                            p.active ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/productos/${p.id}/editar`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleting({ id: p.id, name: p.name })}
                          className="text-xs font-semibold text-red-500 hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title={`¿Eliminar "${deleting?.name}"?`}
        message="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteLoading}
        destructive
      />
    </div>
  )
}
