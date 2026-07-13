'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import type { Brand, Category, Product, ProductImage } from '@/lib/generated/prisma/client'
import ImageUploader, { type ImageEntry } from '@/components/admin/ImageUploader'
import { useToastStore } from '@/lib/store/useToastStore'

type FullProduct = Product & { brand: Brand; category: Category; images: ProductImage[] }

interface Props {
  product?: FullProduct
  categories: Pick<Category, 'id' | 'name' | 'slug'>[]
  brands: Pick<Brand, 'id' | 'name' | 'color'>[]
}

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  slug: z
    .string()
    .min(1, 'El slug es obligatorio')
    .regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  sku: z.string().min(1, 'El SKU es obligatorio'),
  brand: z.string().min(1, 'La marca es obligatoria'),
  brandColor: z.string(),
  category: z.string().min(1, 'La categoría es obligatoria'),
  price: z.number().positive('El precio debe ser mayor a 0'),
  originalPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
  description: z.string().min(1, 'La descripción es obligatoria'),
  featuresText: z.string(),
  badge: z.string().nullable().optional(),
  inStock: z.boolean(),
  active: z.boolean(),
})

type FormValues = z.infer<typeof schema>

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function ProductForm({ product, categories, brands }: Props) {
  const router = useRouter()
  const push = useToastStore(s => s.push)
  const isNew = !product

  const [images, setImages] = useState<ImageEntry[]>(() => {
    if (!product) return []
    return [...product.images]
      .sort((a, b) => a.order - b.order)
      .map((img, i) => ({ url: img.url, order: i }))
  })
  const [imageError, setImageError] = useState<string | null>(null)
  const [slugTouched, setSlugTouched] = useState(false)
  const [customBrand, setCustomBrand] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Parse features from JSON (edit mode)
  const featuresDefault = (() => {
    if (!product?.features) return ''
    try {
      const parsed = JSON.parse(product.features)
      return Array.isArray(parsed) ? parsed.join('\n') : ''
    } catch {
      return ''
    }
  })()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      sku: product?.sku ?? '',
      brand: product?.brand?.name ?? '',
      brandColor: product?.brand?.color ?? '#1852D9',
      category: product?.category?.slug ?? '',
      price: product ? Number(product.price) : 0,
      originalPrice: product?.originalPrice != null ? Number(product.originalPrice) : undefined,
      stock: product?.stock ?? 0,
      description: product?.description ?? '',
      featuresText: featuresDefault,
      badge: product?.badge ?? '',
      inStock: product?.inStock ?? true,
      active: product?.active ?? true,
    },
  })

  async function onSubmit(values: FormValues) {
    // Validate images
    const validImages = images.filter(i => i.url && !i.uploading && !i.error)
    if (validImages.length === 0) {
      setImageError('Agrega al menos una imagen.')
      return
    }
    setImageError(null)

    // Parse features
    const features = values.featuresText
      ? values.featuresText
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean)
      : []

    const payload = {
      name: values.name,
      slug: values.slug,
      sku: values.sku,
      brand: values.brand,
      brandColor: values.brandColor,
      category: values.category,
      price: values.price,
      originalPrice: values.originalPrice ?? null,
      stock: values.stock,
      description: values.description,
      features,
      badge: values.badge || null,
      inStock: values.inStock,
      active: values.active,
      images: validImages.map(img => img.url),
    }

    setSubmitting(true)
    try {
      const url = isNew ? '/api/productos' : `/api/productos/${product.id}`
      const method = isNew ? 'POST' : 'PATCH'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        push(isNew ? 'Producto creado' : 'Cambios guardados')
        router.push('/admin/productos')
      } else {
        push((data as { error?: string }).error ?? 'Error al guardar', 'error')
      }
    } catch {
      push('Error de red', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Images */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Imágenes del producto</h2>
        <ImageUploader images={images} onChange={imgs => { setImages(imgs); setImageError(null) }} />
        {imageError && <p className="text-xs text-red-500 mt-2">{imageError}</p>}
      </div>

      {/* Main fields */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700">Información básica</h2>

        {/* Name + Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', {
                onChange(e) {
                  if (isNew && !slugTouched) {
                    setValue('slug', toSlug(e.target.value), { shouldValidate: false })
                  }
                },
              })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
              placeholder="Impresora HP LaserJet Pro M404n"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              {...register('slug', {
                onChange() { setSlugTouched(true) },
              })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary font-mono"
              placeholder="impresora-hp-laserjet-pro-m404n"
            />
            {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        {/* SKU + Badge */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              {...register('sku')}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary font-mono"
              placeholder="HP-M404N-001"
            />
            {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge (opcional)</label>
            <input
              {...register('badge')}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
              placeholder="Nuevo, Oferta, Popular…"
            />
          </div>
        </div>

        {/* Brand + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Marca <span className="text-red-500">*</span>
            </label>
            {customBrand ? (
              <div className="flex gap-2">
                <input
                  {...register('brand')}
                  autoFocus
                  className="flex-1 h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
                  placeholder="Nombre de la nueva marca"
                />
                <button
                  type="button"
                  onClick={() => { setCustomBrand(false); setValue('brand', '') }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <select
                {...register('brand')}
                onChange={e => {
                  if (e.target.value === '__nueva__') {
                    setCustomBrand(true)
                    setValue('brand', '', { shouldValidate: false })
                  } else {
                    setValue('brand', e.target.value, { shouldValidate: true })
                  }
                }}
                className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
              >
                <option value="">Seleccionar marca…</option>
                {brands.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
                <option value="__nueva__">+ Nueva marca…</option>
              </select>
            )}
            {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              {...register('category')}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">Seleccionar categoría…</option>
              {categories.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
          </div>
        </div>

        {/* Brand color */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Color de marca</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                {...register('brandColor')}
                className="h-9 w-12 rounded border border-gray-200 cursor-pointer p-0.5"
              />
              <span className="text-xs text-gray-400 font-mono">{watch('brandColor')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700">Precio y stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Precio (Bs.) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
              placeholder="1500"
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Precio original (Bs.) <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              {...register('originalPrice', {
                setValueAs: (v) => (v === '' || v === undefined) ? undefined : Number(v),
              })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
              placeholder="1800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step={1}
              {...register('stock', { valueAsNumber: true })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm outline-none focus:border-primary"
              placeholder="10"
            />
            {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock.message}</p>}
          </div>
        </div>
      </div>

      {/* Description & Features */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <h2 className="text-sm font-bold text-gray-700">Descripción y características</h2>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Descripción <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-y"
            placeholder="Descripción completa del producto…"
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Características <span className="text-gray-400">(una por línea)</span>
          </label>
          <textarea
            {...register('featuresText')}
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-y font-mono"
            placeholder={"Velocidad: 38 ppm\nConectividad: Wi-Fi, Ethernet\nDúplex automático"}
          />
        </div>
      </div>

      {/* Visibility */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Visibilidad</h2>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" {...register('inStock')} className="w-4 h-4 rounded accent-primary" />
            <span className="text-sm text-gray-700">En stock (visible para compra)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" {...register('active')} className="w-4 h-4 rounded accent-primary" />
            <span className="text-sm text-gray-700">Producto activo (visible en tienda)</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pb-4">
        <Link
          href="/admin/productos"
          className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60"
        >
          {submitting ? 'Guardando…' : isNew ? 'Crear producto' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
