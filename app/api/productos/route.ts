import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { PRODUCT_INCLUDE } from '@/lib/db-utils'
import { auth } from '@/auth'
import { requireAdmin, isAdmin } from '@/lib/auth-guards'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cat = searchParams.get('cat')
  const q = searchParams.get('q')
  const activeParam = searchParams.get('active')

  // Por defecto solo productos activos.
  // El parámetro ?active=false solo lo honramos si quien pide es admin;
  // un visitante anónimo no puede ver productos ocultos.
  let activeFilter: boolean | undefined = true
  if (activeParam !== null) {
    const session = await auth()
    if (isAdmin(session?.user?.email)) {
      activeFilter = activeParam !== 'false'
    }
  }

  const where = {
    active: activeFilter,
    ...(cat ? { category: { slug: cat } } : {}),
    ...(q ? {
      OR: [
        { name: { contains: q } },
        { brand: { name: { contains: q } } },
        { sku: { contains: q } },
      ],
    } : {}),
  }

  const products = await prisma.product.findMany({
    where,
    include: PRODUCT_INCLUDE,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ products, total: products.length })
}

async function resolveOrCreateBrand(brandName: string, brandColor?: string) {
  const slug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return prisma.brand.upsert({
    where: { slug },
    update: { ...(brandColor ? { color: brandColor } : {}) },
    create: { name: brandName, slug, color: brandColor ?? '#1852D9' },
  })
}

async function resolveCategory(categorySlug: string) {
  const cat = await prisma.category.findUnique({ where: { slug: categorySlug } })
  if (!cat) throw new Error(`Categoría no encontrada: ${categorySlug}`)
  return cat
}

export async function POST(req: NextRequest) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const body = await req.json()

  const required = ['slug', 'name', 'brand', 'price', 'category', 'description', 'sku']
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
    }
  }

  const existing = await prisma.product.findFirst({
    where: { OR: [{ slug: body.slug }, { sku: body.sku }] },
  })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe un producto con ese slug o SKU' }, { status: 409 })
  }

  try {
    const brand = await resolveOrCreateBrand(body.brand, body.brandColor)
    const category = await resolveCategory(body.category)

    const features = Array.isArray(body.features) ? JSON.stringify(body.features) : body.features ?? '[]'
    const imageUrls: string[] = Array.isArray(body.images) ? body.images : (body.image ? [body.image] : [])

    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        name: body.name,
        brandId: brand.id,
        categoryId: category.id,
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        rating: body.rating ? Number(body.rating) : 5,
        reviewCount: body.reviewCount ? Number(body.reviewCount) : 0,
        badge: body.badge ?? null,
        description: body.description,
        features,
        inStock: body.inStock ?? true,
        sku: body.sku,
        active: body.active ?? true,
        images: {
          create: imageUrls.map((url, i) => ({ url, order: i })),
        },
      },
      include: PRODUCT_INCLUDE,
    })

    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error interno' }, { status: 500 })
  }
}
