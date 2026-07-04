import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Debes iniciar sesión para dejar una reseña' }, { status: 401 })
  }

  const { productId, rating, body } = await req.json()

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Datos de reseña inválidos' }, { status: 400 })
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })

  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId, userId: session.user.id } },
  })
  if (existing) {
    return NextResponse.json({ error: 'Ya dejaste una reseña para este producto' }, { status: 409 })
  }

  const review = await prisma.review.create({
    data: { productId, userId: session.user.id, rating: Number(rating), body: body?.trim() || null },
    include: { user: { select: { name: true } } },
  })

  // Update cached rating on product
  const stats = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  })
  await prisma.product.update({
    where: { id: productId },
    data: {
      rating: Math.round((stats._avg.rating ?? 5) * 10) / 10,
      reviewCount: stats._count.rating,
    },
  })

  return NextResponse.json({ review }, { status: 201 })
}
