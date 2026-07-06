import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireSession, requireAdmin, isAdmin } from '@/lib/auth-guards'

type Params = { params: Promise<{ id: string }> }

const VALID_STATUSES = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado']

export async function GET(_req: NextRequest, { params }: Params) {
  const { session, authError } = await requireSession()
  if (authError) return authError

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

  // Admin ve cualquier orden; usuario solo ve las suyas
  const isOwner =
    (order.userId && order.userId === session!.user.id) ||
    order.clientEmail === session!.user.email

  if (!isAdmin(session!.user.email) && !isOwner) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  return NextResponse.json({ order })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const { id } = await params
  const body = await req.json()

  const existing = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  })
  if (!existing) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

  if (body.status && !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json(
      { error: `Estado inválido. Válidos: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const allowed = [
    'status', 'tieneFactura', 'paymentMethod', 'notes',
    'clientName', 'clientEmail', 'clientPhone',
    'clientAddress', 'clientCity', 'clientState', 'clientZip',
  ]
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) data[key] = body[key]
  }

  // Restaurar stock si la orden pasa a cancelado (y no estaba ya cancelada)
  const cancelando = body.status === 'cancelado' && existing.status !== 'cancelado'

  if (cancelando) {
    for (const item of existing.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    }
  }

  const order = await prisma.order.update({
    where: { id },
    data,
    include: { items: { include: { product: true } } },
  })

  return NextResponse.json({ order })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { adminError } = await requireAdmin()
  if (adminError) return adminError

  const { id } = await params
  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

  // Solo se permite eliminar órdenes ya canceladas: la cancelación restauró el stock,
  // así que el delete no deja stock fantasma.
  if (existing.status !== 'cancelado') {
    return NextResponse.json(
      { error: 'Solo se pueden eliminar órdenes canceladas. Cancela la orden primero para restaurar el stock.' },
      { status: 409 }
    )
  }

  try {
    await prisma.order.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al eliminar la orden' },
      { status: 500 }
    )
  }
}
