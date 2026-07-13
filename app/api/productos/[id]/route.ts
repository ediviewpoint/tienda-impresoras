import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { del } from '@vercel/blob'
import { prisma } from '@/lib/db'
import { PRODUCT_INCLUDE } from '@/lib/db-utils'
import { requireAdmin } from '@/lib/auth-guards'

function isBlobUrl(url: string) {
  return url.includes('blob.vercel-storage.com')
}

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, include: PRODUCT_INCLUDE })
  if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const { id } = await params
  const [body, existing] = await Promise.all([
    req.json(),
    prisma.product.findUnique({ where: { id } }),
  ])
  if (!existing) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  try {
    const data: Record<string, unknown> = {}

    if ('name' in body) data.name = body.name
    if ('price' in body) {
      const price = Number(body.price)
      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json({ error: 'El precio debe ser un número positivo' }, { status: 400 })
      }
      data.price = price
    }
    if ('originalPrice' in body) data.originalPrice = body.originalPrice ? Number(body.originalPrice) : null
    if ('rating' in body) data.rating = Number(body.rating)
    if ('reviewCount' in body) data.reviewCount = Number(body.reviewCount)
    if ('badge' in body) data.badge = body.badge ?? null
    if ('description' in body) data.description = body.description
    if ('stock' in body) data.stock = Math.max(0, Number(body.stock))
    if ('inStock' in body) data.inStock = body.inStock
    if ('active' in body) data.active = body.active
    if ('sku' in body) data.sku = body.sku
    if ('slug' in body) data.slug = body.slug
    if ('features' in body) {
      data.features = Array.isArray(body.features) ? JSON.stringify(body.features) : body.features
    }

    if ('brand' in body && body.brand) {
      const slug = (body.brand as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      const brand = await prisma.brand.upsert({
        where: { slug },
        update: { ...(body.brandColor ? { color: body.brandColor } : {}) },
        create: { name: body.brand, slug, color: body.brandColor ?? '#1852D9' },
      })
      data.brandId = brand.id
    }

    if ('category' in body && body.category) {
      const cat = await prisma.category.findUnique({ where: { slug: body.category } })
      if (!cat) return NextResponse.json({ error: `Categoría no encontrada: ${body.category}` }, { status: 400 })
      data.categoryId = cat.id
    }

    if ('images' in body || 'image' in body) {
      const imageUrls: string[] = Array.isArray(body.images)
        ? body.images
        : (body.image ? [body.image] : [])

      const existing = await prisma.productImage.findMany({ where: { productId: id } })
      const removedBlobUrls = existing
        .map(img => img.url)
        .filter(url => !imageUrls.includes(url) && isBlobUrl(url))

      await prisma.productImage.deleteMany({ where: { productId: id } })
      data.images = {
        create: imageUrls.map((url: string, i: number) => ({ url, order: i })),
      }

      if (removedBlobUrls.length > 0) del(removedBlobUrls).catch(() => {})
    }

    const product = await prisma.product.update({ where: { id }, data, include: PRODUCT_INCLUDE })

    revalidatePath('/')
    revalidatePath('/catalogo')
    revalidatePath(`/producto/${product.slug}`)
    revalidatePath('/producto/[slug]', 'page')

    return NextResponse.json({ product })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  try {
    const productImages = await prisma.productImage.findMany({ where: { productId: id } })
    const blobUrls = productImages.map(img => img.url).filter(isBlobUrl)

    await prisma.product.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/catalogo')
    revalidatePath(`/producto/${existing.slug}`)
    revalidatePath('/producto/[slug]', 'page')

    if (blobUrls.length > 0) del(blobUrls).catch(() => {})
    return NextResponse.json({ success: true })
  } catch (err) {
    // P2003: foreign key constraint (tiene OrderItems asociados)
    if (typeof err === 'object' && err !== null && (err as Record<string, unknown>).code === 'P2003') {
      return NextResponse.json(
        { error: 'No se puede eliminar: el producto tiene órdenes históricas asociadas. Desactívalo en su lugar.' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al eliminar el producto' },
      { status: 500 }
    )
  }
}
