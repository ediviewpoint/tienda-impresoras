import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { dbToUIProduct } from '@/lib/db-utils'
import { ProductDetail } from './ProductDetail'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await prisma.product.findUnique({ where: { slug, active: true } })
  if (!p) return { title: 'Producto no encontrado' }

  const title = `${p.name} | PrintMax`
  const description = `${p.description} — Desde $${p.price.toLocaleString('es-MX')} MXN.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'PrintMax',
      ...(p.image ? { images: [{ url: p.image, width: 600, height: 400 }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const p = await prisma.product.findUnique({ where: { slug, active: true } })
  if (!p) notFound()
  return <ProductDetail product={dbToUIProduct(p)} />
}
