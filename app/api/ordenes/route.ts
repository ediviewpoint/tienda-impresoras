import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getResend, FROM, ADMIN_EMAIL } from '@/lib/email'
import OrderConfirmation from '@/emails/OrderConfirmation'
import AdminNewOrder from '@/emails/AdminNewOrder'

function generateOrderNumber() {
  const date = new Date()
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `ORD-${ymd}-${rand}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = Number(searchParams.get('limit') ?? 50)
  const offset = Number(searchParams.get('offset') ?? 0)

  const where = status ? { status } : {}

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.order.count({ where }),
  ])

  return NextResponse.json({ orders, total })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const required = ['clientName', 'clientEmail', 'items']
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
    }
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'El pedido debe tener al menos un producto' }, { status: 400 })
  }

  const productIds: string[] = body.items.map((i: { productId: string }) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'Uno o más productos no existen' }, { status: 400 })
  }

  const productMap = new Map(products.map(p => [p.id, p]))
  const itemsData = body.items.map((item: { productId: string; quantity: number; unitPrice?: number }) => {
    const product = productMap.get(item.productId)!
    const unitPrice = item.unitPrice ?? product.price
    return {
      productId: item.productId,
      quantity: Number(item.quantity),
      unitPrice,
      total: unitPrice * Number(item.quantity),
    }
  })

  const subtotal = itemsData.reduce((sum: number, i: { total: number }) => sum + i.total, 0)
  const shipping = Number(body.shipping ?? 0)
  const total = subtotal + shipping

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      status: body.status ?? 'pendiente',
      tieneFactura: body.tieneFactura ?? true,
      subtotal,
      shipping,
      total,
      paymentMethod: body.paymentMethod ?? 'manual',
      notes: body.notes ?? null,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone ?? null,
      clientAddress: body.clientAddress ?? null,
      clientCity: body.clientCity ?? null,
      clientState: body.clientState ?? null,
      clientZip: body.clientZip ?? null,
      userId: body.userId ?? null,
      items: { create: itemsData },
    },
    include: { items: { include: { product: true } } },
  })

  // Emails — fire and forget (no bloquea la respuesta)
  if (process.env.RESEND_API_KEY) {
    const emailItems = order.items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      total: i.total,
    }))

    getResend().emails.send({
      from: FROM,
      to: order.clientEmail,
      subject: `Tu pedido ${order.orderNumber} ha sido recibido — PrintMax`,
      react: OrderConfirmation({
        orderNumber: order.orderNumber,
        clientName: order.clientName,
        items: emailItems,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        tieneFactura: order.tieneFactura,
        paymentMethod: order.paymentMethod,
      }),
    })

    getResend().emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `🛒 Nuevo pedido ${order.orderNumber} — ${order.clientName}`,
      react: AdminNewOrder({
        orderNumber: order.orderNumber,
        clientName: order.clientName,
        clientEmail: order.clientEmail,
        total: order.total,
        paymentMethod: order.paymentMethod,
        itemCount: order.items.length,
      }),
    })
  }

  return NextResponse.json({ order }, { status: 201 })
}
