import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  return NextResponse.json({ product })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()

  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  const data: Record<string, unknown> = {}
  const allowed = [
    'name', 'brand', 'brandColor', 'price', 'originalPrice', 'rating',
    'reviewCount', 'badge', 'category', 'description', 'inStock', 'active',
  ]
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }
  if ('features' in body) {
    data.features = Array.isArray(body.features) ? JSON.stringify(body.features) : body.features
  }
  if ('price' in data) data.price = Number(data.price)
  if ('originalPrice' in data) data.originalPrice = data.originalPrice ? Number(data.originalPrice) : null
  if ('rating' in data) data.rating = Number(data.rating)
  if ('reviewCount' in data) data.reviewCount = Number(data.reviewCount)

  const product = await prisma.product.update({ where: { id }, data })
  return NextResponse.json({ product })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
