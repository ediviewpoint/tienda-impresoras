import { Package, AlertTriangle, ShoppingBag, DollarSign } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/ui/OrderStatusBadge'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [totalProducts, lowStockCount, pendingOrders, monthRevenue, recentOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { stock: { lte: 3 }, active: true } }),
    prisma.order.count({ where: { status: 'pendiente' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { not: 'cancelado' },
        createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: true },
    }),
  ])

  const stats = [
    {
      label: 'Total productos activos',
      value: totalProducts,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Stock bajo (≤3)',
      value: lowStockCount,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Pedidos pendientes',
      value: pendingOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Ventas del mes',
      value: formatPrice(Number(monthRevenue._sum.total ?? 0)),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{label}</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-extrabold text-gray-900">Pedidos recientes</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-center py-10 text-gray-400 text-sm">Sin pedidos aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                {['Número', 'Cliente', 'Total', 'Estado', 'Fecha'].map(h => (
                  <th key={h} className="px-5 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{o.orderNumber}</td>
                  <td className="px-5 py-3 font-semibold text-gray-800">{o.clientName}</td>
                  <td className="px-5 py-3 font-semibold">{formatPrice(Number(o.total))}</td>
                  <td className="px-5 py-3">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString('es-BO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
