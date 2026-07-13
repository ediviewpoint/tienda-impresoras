'use client'

import { useState } from 'react'
import type { Category } from '@/lib/generated/prisma/client'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import { useToastStore } from '@/lib/store/useToastStore'

type CatWithCount = Category & { _count: { products: number } }

export default function CategoriesManager({ categories: initial }: { categories: CatWithCount[] }) {
  const [categories, setCategories] = useState(initial)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState<CatWithCount | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const push = useToastStore(s => s.push)

  async function handleCreate() {
    const name = newName.trim()
    if (!name) return
    setActionLoading(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    setActionLoading(false)
    if (res.ok) {
      setCategories(cs => [...cs, { ...data.category, _count: { products: 0 } }].sort((a, b) => a.name.localeCompare(b.name)))
      setCreating(false)
      setNewName('')
      push('Categoría creada')
    } else {
      push(data.error ?? 'Error al crear la categoría', 'error')
    }
  }

  async function handleRename() {
    if (!editing) return
    const name = editing.name.trim()
    if (!name) { setEditing(null); return }
    setActionLoading(true)
    const res = await fetch(`/api/categories/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const data = await res.json()
    setActionLoading(false)
    if (res.ok) {
      setCategories(cs =>
        cs.map(c => c.id === editing.id ? { ...c, ...data.category } : c)
          .sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditing(null)
      push('Categoría actualizada')
    } else {
      push(data.error ?? 'Error al actualizar', 'error')
    }
  }

  async function handleDelete() {
    if (!deleting) return
    setActionLoading(true)
    const res = await fetch(`/api/categories/${deleting.id}`, { method: 'DELETE' })
    const data = await res.json()
    setActionLoading(false)
    if (res.ok) {
      setCategories(cs => cs.filter(c => c.id !== deleting.id))
      push(`"${deleting.name}" eliminada`)
    } else {
      push(data.error ?? 'Error al eliminar', 'error')
    }
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => { setCreating(true); setNewName('') }}
          className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <span>+</span> Nueva categoría
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-xl border border-primary/30 p-4 flex gap-3 items-center">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setCreating(false) }}
            placeholder="Nombre de la categoría"
            className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={handleCreate}
            disabled={actionLoading || !newName.trim()}
            className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60 hover:bg-primary-dark transition-colors"
          >
            {actionLoading ? '…' : 'Crear'}
          </button>
          <button
            onClick={() => setCreating(false)}
            className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
              <th className="px-4 py-3 font-semibold">Nombre</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Productos</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400">Sin categorías.</td>
              </tr>
            ) : (
              categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3">
                    {editing?.id === cat.id ? (
                      <input
                        autoFocus
                        value={editing.name}
                        onChange={e => setEditing({ ...editing, name: e.target.value })}
                        onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(null) }}
                        onBlur={handleRename}
                        className="h-8 border border-primary rounded-lg px-2 text-sm outline-none w-48"
                      />
                    ) : (
                      <span className="font-semibold text-gray-800">{cat.name}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                      {cat._count.products}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditing({ id: cat.id, name: cat.name })}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Renombrar
                      </button>
                      <button
                        onClick={() => setDeleting(cat)}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title={`¿Eliminar "${deleting?.name}"?`}
        message={
          deleting?._count.products
            ? `Esta categoría tiene ${deleting._count.products} producto(s) asociado(s). Reasígnalos antes de eliminar.`
            : 'Esta acción no se puede deshacer.'
        }
        onConfirm={deleting?._count.products ? () => setDeleting(null) : handleDelete}
        onCancel={() => setDeleting(null)}
        loading={actionLoading}
        destructive={!deleting?._count.products}
      />
    </div>
  )
}
