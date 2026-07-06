import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getResend, FROM, ADMIN_EMAIL } from '@/lib/email'
import OrderConfirmation from '@/emails/OrderConfirmation'
import AdminNewOrder from '@/emails/AdminNewOrder'
import { requireSession, isAdmin } from '@/lib/auth-guards'
import { randomInt } from 'crypto'
import { IVA_RATE, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/utils'

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
  const body = await req.json()

  // ── Validación de campos de contacto ────────────────────────────────────────
  const required = ['clientName', 'clientEmail', 'items']
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 })
    }
  }

  // ── Validación estricta de items ─────────────────────────────────────────────
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'El pedido debe tener al menos un producto' }, { status: 400 })
  }
  if (body.items.length > 30) {
    return NextResponse.json({ error: 'Máximo 30 productos por pedido' }, { status: 400 })
  }
  for (const item of body.items) {
    if (typeof item.productId !== 'string' || item.productId.trim() === '') {
      return NextResponse.json({ error: 'productId inválido en uno de los ítems' }, { status: 400 })
    }
    const qty = Number(item.quantity)
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
      return NextResponse.json({
        error: `Cantidad inválida (productId: "${item.productId}"): debe ser entero entre 1 y 50`
      }, { status: 400 })
    }
  }

  // ── Cargar productos desde BD — el precio SIEMPRE viene de aquí, nunca del cliente ──
  const productIds: string[] = body.items.map((i: { productId: string }) => i.productId)
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
  if (products.length !== productIds.length) {
    return NextResponse.json({ error: 'Uno o más productos no existen' }, { status: 400 })
  }

  // Verificar que todos los productos estén activos
  const inactive = products.find(p => !p.active)
  if (inactive) {
    return NextResponse.json(
      { error: `Producto no disponible: "${inactive.name}"` },
      { status: 409 }
    )
  }

  // ── Calcular precios 100% server-side ────────────────────────────────────────
  // El cliente SOLO manda productId y quantity. unitPrice y totales los calcula el servidor.
  const tieneFactura = body.tieneFactura !== false

  const productMap = new Map(products.map(p => [p.id, p]))
  const requestedItems: { productId: string; quantity: number }[] = body.items.map(
    (i: { productId: string; quantity: number }) => ({
      productId: i.productId,
      quantity: Number(i.quantity),
    })
  )

  const itemsData = requestedItems.map(item => {
    const product = productMap.get(item.productId)!
    const basePrice = Number(product.price)
    // Precio final según factura, calculado en el servidor
    const unitPrice = tieneFactura
      ? basePrice
      : Math.round((basePrice / (1 + IVA_RATE)) * 100) / 100
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      total: Math.round(unitPrice * item.quantity * 100) / 100,
    }
  })

  const subtotal = Math.round(itemsData.reduce((sum, i) => sum + i.total, 0) * 100) / 100
  // Envío calculado server-side con las mismas constantes que el frontend
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = Math.round((subtotal + shipping) * 100) / 100

  // ── Reserva de stock + creación de orden ────────────────────────────────────
  const decremented: typeof itemsData = []
  let order
  try {
    for (const item of itemsData) {
      const { count } = await prisma.product.updateMany({
        where: {
          id: item.productId,
          inStock: true,
          active: true,
          stock: { gte: item.quantity },
        },
        data: { stock: { decrement: item.quantity } },
      })

      if (!count) {
        for (const prev of decremented) {
          await prisma.product.update({
            where: { id: prev.productId },
            data: { stock: { increment: prev.quantity } },
          })
        }
        const p = productMap.get(item.productId)!
        return NextResponse.json(
          { error: `Stock insuficiente: "${p.name}" (solicitado: ${item.quantity})`, code: 'STOCK_INSUFICIENTE' },
          { status: 409 }
        )
      }
      decremented.push(item)
    }

    const createdOrder = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        status: body.status ?? 'pendiente',
        tieneFactura,
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
      },
    })

    await prisma.orderItem.createMany({
      data: itemsData.map(item => ({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
      })),
    })

    order = await prisma.order.findUnique({
      where: { id: createdOrder.id },
      include: { items: { include: { product: true } } },
    })
  } catch (err) {
    for (const item of decremented) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    }
    // DIAGNOSTIC: expose actual error for debugging (remove after issue identified)
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : String(err),
        errorName: err instanceof Error ? err.name : undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errorCode: (err as any)?.code,
        decrementsAttempted: decremented.length,
      },
      { status: 500 }
    )
  }

  if (!order) throw new Error('Order created but could not be fetched')

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
