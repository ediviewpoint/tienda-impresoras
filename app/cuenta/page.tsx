import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import CuentaClient from './CuentaClient'

export default async function CuentaPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login?callbackUrl=/cuenta')

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { items: { include: { product: true } } },
  })

  return (
    <CuentaClient
      user={{
        name: session.user.name ?? '',
        email: session.user.email ?? '',
        image: session.user.image ?? null,
      }}
      orders={orders}
    />
  )
}
