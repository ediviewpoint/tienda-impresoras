import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
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
  const [body, existing] = await Promise.all([
    req.json(),
    prisma.order.findUnique({ where: { id }, include: { items: true } }),
  ])
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

  const order = await prisma.$transaction(async (tx) => {
    if (cancelando) {
      for (const item of existing.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      }
    }
    return tx.order.update({
      where: { id },
      data,
      include: { items: { include: { product: true } } },
    })
  })

  // If the order was cancelled, stock was restored — revalidate catalogue pages
  if (cancelando) {
    revalidatePath('/')
    revalidatePath('/catalogo')
    for (const item of order.items) {
      revalidatePath(`/producto/${item.product.slug}`)
    }
    revalidatePath('/producto/[slug]', 'page')
  }

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
