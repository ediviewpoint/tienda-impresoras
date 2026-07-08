import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { dbToUIProduct } from '@/lib/db-utils'
import { ProductDetail } from './ProductDetail'
import { ReviewForm } from '@/components/product/ReviewForm'
import { Breadcrumb } from '@/components/ui/Breadcrumb'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await prisma.product.findUnique({
    where: { slug, active: true },
    include: { brand: true, category: true, images: { orderBy: { order: 'asc' } } },
  })
  if (!p) return { title: 'Producto no encontrado' }

  const title = `${p.name} | PrintMax`
  const description = `${p.description} — Desde Bs. ${Number(p.price).toLocaleString('es-BO')}.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'PrintMax',
      ...(p.images[0] ? { images: [{ url: p.images[0].url, width: 600, height: 400 }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const p = await prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { order: 'asc' } },
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!p) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    sku: p.sku,
    brand: { '@type': 'Brand', name: p.brand.name },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BOB',
      price: p.price,
      availability: p.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'PrintMax' },
    },
    ...(p.images[0] ? { image: p.images[0].url } : {}),
    ...(p.rating ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: p.rating,
        reviewCount: p.reviewCount,
      },
    } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumb items={[
        { label: 'Inicio', href: '/' },
        { label: 'Catálogo', href: '/catalogo' },
        { label: p.category.name, href: `/catalogo?cat=${p.category.slug}` },
        { label: p.name },
      ]} />
      <ProductDetail product={dbToUIProduct(p)} />
      <ReviewForm
        productId={p.id}
        initialReviews={p.reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          body: r.body,
          createdAt: r.createdAt.toISOString(),
          user: r.user,
        }))}
      />
    </>
  )
}
