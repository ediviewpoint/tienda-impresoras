import { prisma } from '@/lib/db'
import AdminShell from './AdminShell'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [productCount, orderCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
  ])

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: 'cancelado' } },
  })

  const stats = {
    products: productCount,
    orders: orderCount,
    revenue: revenue._sum.total ?? 0,
    recentOrders: orders,
  }

  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })

  return <AdminShell stats={stats} initialProducts={products} />
}
