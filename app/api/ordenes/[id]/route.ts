import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type Params = { params: Promise<{ id: string }> }

const VALID_STATUSES = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado']

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })
  return NextResponse.json({ order })
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  const body = await req.json()

  const existing = await prisma.order.findUnique({ where: { id } })
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

  const order = await prisma.order.update({
    where: { id },
    data,
    include: { items: { include: { product: true } } },
  })
  return NextResponse.json({ order })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const existing = await prisma.order.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 })

  await prisma.order.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
