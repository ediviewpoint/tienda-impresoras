import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getResend, FROM, ADMIN_EMAIL } from '@/lib/email'
import OrderConfirmation from '@/emails/OrderConfirmation'
import AdminNewOrder from '@/emails/AdminNewOrder'
import { requireSession, isAdmin } from '@/lib/auth-guards'
import { randomInt } from 'crypto'

function generateOrderNumber() {
  const d = new Date()
  const pad = (n: number, l = 2) => String(n).padStart(l, '0')
  const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  const rand = pad(randomInt(0, 1_000_000), 6)
  return `ORD-${ts}-${rand}`
}

export async function GET(req: NextRequest) {
  const { session, authError } = await requireSession()
  if (authError) return authError

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
  const offset = Number(searchParams.get('offset') ?? 0)

  // Admin ve todas las órdenes; usuario normal ve solo las suyas
  const userWhere = isAdmin(session!.user.email)
    ? {}
    : {
        OR: [
          { userId: session!.user.id as string },
          { clientEmail: session!.user.email as string },
        ],
      }

  const where = {
    ...userWhere,
    ...(status ? { status } : {}),
  }

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
  // El checkout es público: clientes compran sin necesidad de cuenta
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

  const requestedItems: { productId: string; quantity: number; unitPrice?: number }[] = body.items

  // Calcular montos fuera de la transacción (no requieren bloqueo)
  const productIds = requestedItems.map(i => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'Uno o más productos no existen' }, { status: 400 })
  }

  const productMap = new Map(products.map(p => [p.id, p]))
  const itemsData = requestedItems.map(item => {
    const product = productMap.get(item.productId)!
    const unitPrice = Number(item.unitPrice ?? product.price)
    return {
      productId: item.productId,
      quantity: Number(item.quantity),
      unitPrice,
      total: unitPrice * Number(item.quantity),
    }
  })

  const subtotal = itemsData.reduce((sum, i) => sum + i.total, 0)
  const shipping = Number(body.shipping ?? 0)
  const total = subtotal + shipping

  // Transacción: verificar stock + decrementar + crear orden de forma atómica
  let order
  try {
    order = await prisma.$transaction(async (tx) => {
      // UPDATE atómico: descuenta solo si hay stock suficiente e inStock=true.
      // Retorna 0 filas si no hay stock → lanza error sin necesidad de SELECT previo.
      for (const item of itemsData) {
        const affected = await tx.$executeRaw`
          UPDATE "Product"
          SET "stock" = "stock" - ${item.quantity}
          WHERE "id" = ${item.productId}
            AND "inStock" = true
            AND "stock" >= ${item.quantity}
        `
        if (affected === 0) {
          const p = productMap.get(item.productId)!
          throw Object.assign(
            new Error(`Stock insuficiente: "${p.name}" (solicitado: ${item.quantity})`),
            { code: 'STOCK_INSUFICIENTE', productName: p.name }
          )
        }
      }

      return tx.order.create({
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
    })
  } catch (err) {
    if (err instanceof Error && (err as NodeJS.ErrnoException & { code?: string }).code === 'STOCK_INSUFICIENTE') {
      return NextResponse.json({ error: err.message, code: 'STOCK_INSUFICIENTE' }, { status: 409 })
    }
    throw err
  }

  if (process.env.RESEND_API_KEY) {
    const emailItems = order.items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      total: Number(i.total),
    }))

    getResend().emails.send({
      from: FROM,
      to: order.clientEmail,
      subject: `Tu pedido ${order.orderNumber} ha sido recibido — PrintMax`,
      react: OrderConfirmation({
        orderNumber: order.orderNumber,
        clientName: order.clientName,
        items: emailItems,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        total: Number(order.total),
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
        total: Number(order.total),
        paymentMethod: order.paymentMethod,
        itemCount: order.items.length,
      }),
    })
  }

  return NextResponse.json({ order }, { status: 201 })
}
