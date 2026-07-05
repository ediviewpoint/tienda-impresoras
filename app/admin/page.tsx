import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { PRODUCT_INCLUDE } from '@/lib/db-utils'
import AdminShell from './AdminShell'

export const dynamic = 'force-dynamic'

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL ?? 'admin@printmax.bo').split(',').map(e => e.trim())

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    redirect('/auth/login?callbackUrl=/admin')
  }

  const [productCount, orderCount, orders, revenue, products] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'cancelado' } },
    }),
    prisma.product.findMany({
      include: PRODUCT_INCLUDE,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  const stats = {
    products: productCount,
    orders: orderCount,
    revenue: Number(revenue._sum.total ?? 0),
    recentOrders: orders,
  }

  return <AdminShell stats={stats} initialProducts={products} />
}
