import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cat = searchParams.get('cat')
  const q = searchParams.get('q')
  const active = searchParams.get('active')

  const where = {
    ...(cat ? { category: cat } : {}),
    ...(active !== null ? { active: active !== 'false' } : {}),
    ...(q ? {
      OR: [
        { name: { contains: q } },
        { brand: { contains: q } },
        { sku: { contains: q } },
      ],
    } : {}),
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ products, total: products.length })
}

export async function POST(req: NextRequest) {
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

  const product = await prisma.product.create({
    data: {
      slug: body.slug,
      name: body.name,
      brand: body.brand,
      brandColor: body.brandColor ?? '#1852D9',
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
      rating: body.rating ? Number(body.rating) : 5,
      reviewCount: body.reviewCount ? Number(body.reviewCount) : 0,
      badge: body.badge ?? null,
      category: body.category,
      description: body.description,
      features: Array.isArray(body.features) ? JSON.stringify(body.features) : body.features ?? '[]',
      inStock: body.inStock ?? true,
      sku: body.sku,
      active: body.active ?? true,
    },
  })

  return NextResponse.json({ product }, { status: 201 })
}
