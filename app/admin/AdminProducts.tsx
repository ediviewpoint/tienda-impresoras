'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product, Brand, Category, ProductImage } from '@/lib/generated/prisma/client'
import ImageUploader, { type ImageEntry } from '@/components/admin/ImageUploader'

type FullProduct = Product & { brand: Brand; category: Category; images: ProductImage[] }

interface Props {
  initialProducts: FullProduct[]
}

const BADGE_OPTIONS = ['', 'new', 'sale', 'hot', 'best']

type EditForm = {
  id?: string
  name: string
  brand: string
  brandColor: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  badge: string | null
  category: string
  description: string
  featuresText: string
  images: ImageEntry[]
  stock: number
  inStock: boolean
  active: boolean
  sku: string
  slug: string
}

const EMPTY_FORM: EditForm = {
  name: '', brand: '', brandColor: '#1852D9', price: 0, originalPrice: undefined,
  rating: 5, reviewCount: 0, badge: null, category: 'laser',
  description: '', featuresText: '', images: [], stock: 0, inStock: true, active: true, sku: '', slug: '',
}

function toSlug(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminProducts({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [editing, setEditing] = useState<EditForm | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('')
  const [brands, setBrands] = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/brands').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([b, c]) => {
      setBrands(b.brands ?? [])
      setCategories(c.categories ?? [])
    })
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.brand.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.sku.toLowerCase().includes(filter.toLowerCase())
  )

  function openEdit(p: FullProduct) {
    let featuresText = ''
    try {
      const arr = JSON.parse(p.features)
      featuresText = Array.isArray(arr) ? arr.join('\n') : p.features
    } catch { featuresText = p.features }

    setIsNew(false)
    setEditing({
      id: p.id,
      name: p.name,
      brand: p.brand.name,
      brandColor: p.brand.color,
      price: Number(p.price),
      originalPrice: p.originalPrice != null ? Number(p.originalPrice) : undefined,
      stock: p.stock,
      rating: p.rating,
      reviewCount: p.reviewCount,
      badge: p.badge,
      category: p.category.slug,
      description: p.description,
      featuresText,
      images: p.images.map((img, i) => ({ url: img.url, order: img.order ?? i })),
      inStock: p.inStock,
      active: p.active,
      sku: p.sku,
      slug: p.slug,
    })
  }

  function openNew() {
    setIsNew(true)
    setEditing({ ...EMPTY_FORM })
  }

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    try {
      const features = (editing.featuresText ?? '')
        .split('\n').map(s => s.trim()).filter(Boolean)

      const payload = {
        ...editing,
        features,
        images: editing.images.filter(i => i.url && !i.uploading && !i.error).map(i => i.url),
        slug: editing.slug || toSlug(editing.name ?? ''),
      }

      const url = isNew ? '/api/productos' : `/api/productos/${editing.id}`
      const method = isNew ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      if (isNew) {
        setProducts(ps => [data.product, ...ps])
      } else {
        setProducts(ps => ps.map(p => (p.id === data.product.id ? data.product : p)))
      }
      setEditing(null)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(p: FullProduct) {
    const res = await fetch(`/api/productos/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !p.active }),
    })
    const data = await res.json()
    if (res.ok) setProducts(ps => ps.map(x => (x.id === p.id ? data.product : x)))
  }

  function setField<K extends keyof EditForm>(key: K, value: EditForm[K]) {
    setEditing(f => f ? { ...f, [key]: value } : f)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Productos</h1>
        <div className="flex items-center gap-3">
          <input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Buscar…"
            className="h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary w-48 transition-all"
          />
          <button
            onClick={openNew}
            className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> Nuevo producto
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50">
              {['Producto', 'SKU', 'Categoría', 'Precio', 'Unidades', 'Activo', ''].map(h => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(p => (
              <tr key={p.id} className={!p.active ? 'opacity-50' : ''}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.images[0]?.url ? (
                      <Image src={p.images[0].url} alt={p.name} width={36} height={36} className="rounded-lg object-cover bg-gray-100 flex-shrink-0" unoptimized />
                    ) : (
                      <div className="w-9 h-9 rounded-lg flex-shrink-0" style={{ background: `${p.brand.color}20` }} />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 line-clamp-1">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold capitalize">{p.category.name}</span>
                </td>
                <td className="px-4 py-3 font-semibold">{formatPrice(Number(p.price))}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.stock > 0 && p.inStock ? 'bg-success-bg text-success' : 'bg-error-bg text-error'}`}>
                    {p.stock > 0 && p.inStock ? `${p.stock} uds.` : 'Agotado'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${p.active ? 'bg-primary' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${p.active ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(p)} className="text-xs font-semibold text-primary hover:underline">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 shadow-2xl">
            <h2 className="text-lg font-extrabold text-gray-900 mb-5">
              {isNew ? 'Nuevo producto' : 'Editar producto'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">Imágenes del producto</label>
                <ImageUploader
                  images={editing.images}
                  onChange={imgs => setField('images', imgs)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre *</label>
                  <input
                    value={editing.name}
                    onChange={e => {
                      setField('name', e.target.value)
                      if (isNew) setField('slug', toSlug(e.target.value))
                    }}
                    className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Marca *</label>
                  {brands.length > 0 ? (
                    <select
                      value={editing.brand}
                      onChange={e => {
                        const selected = brands.find(b => b.name === e.target.value)
                        setField('brand', e.target.value)
                        if (selected) setField('brandColor', selected.color)
                      }}
                      className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Selecciona…</option>
                      {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                      <option value="__new__">+ Nueva marca…</option>
                    </select>
                  ) : (
                    <input value={editing.brand} onChange={e => setField('brand', e.target.value)} placeholder="Nombre de marca" className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all" />
                  )}
                  {editing.brand === '__new__' && (
                    <input
                      className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all mt-2"
                      placeholder="Nombre de la nueva marca"
                      onChange={e => setField('brand', e.target.value)}
                    />
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">SKU *</label>
                  <input value={editing.sku} onChange={e => setField('sku', e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all font-mono" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Precio *</label>
                  <input type="number" inputMode="decimal" value={editing.price} onChange={e => setField('price', Number(e.target.value))} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Precio original</label>
                  <input type="number" inputMode="decimal" value={editing.originalPrice ?? ''} onChange={e => setField('originalPrice', e.target.value ? Number(e.target.value) : undefined)} placeholder="Opcional" className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Categoría</label>
                  <select value={editing.category} onChange={e => setField('category', e.target.value)} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary">
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Badge</label>
                  <select value={editing.badge ?? ''} onChange={e => setField('badge', e.target.value || null)} className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary">
                    {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || '(ninguno)'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Color de marca</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={editing.brandColor} onChange={e => setField('brandColor', e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1" />
                    <input value={editing.brandColor} onChange={e => setField('brandColor', e.target.value)} className="flex-1 h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary font-mono" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Descripción *</label>
                <textarea value={editing.description} onChange={e => setField('description', e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Características (una por línea)</label>
                <textarea value={editing.featuresText} onChange={e => setField('featuresText', e.target.value)} rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none" />
                <p className="text-[11px] text-gray-400 mt-1">Formato recomendado: <span className="font-mono">RAM: 8GB DDR4</span> — el ícono se asigna automáticamente según la categoría.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Unidades en stock</label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={editing.stock}
                  onChange={e => setField('stock', Math.max(0, Number(e.target.value)))}
                  className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.inStock} onChange={e => setField('inStock', e.target.checked)} className="rounded" />
                  <span className="text-sm font-semibold text-gray-700">Habilitado para venta</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editing.active} onChange={e => setField('active', e.target.checked)} className="rounded" />
                  <span className="text-sm font-semibold text-gray-700">Activo (visible en tienda)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-11 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60"
              >
                {saving ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios'}
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
