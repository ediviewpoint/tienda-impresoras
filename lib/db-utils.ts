import type { Product as PrismaProduct } from '@/lib/generated/prisma/client'
import type { Product } from '@/lib/types'

export function dbToUIProduct(p: PrismaProduct): Product {
  let features: string[] = []
  try {
    const parsed = JSON.parse(p.features)
    features = Array.isArray(parsed) ? parsed : []
  } catch {
    features = []
  }

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    brandColor: p.brandColor,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: (p.badge as Product['badge']) ?? undefined,
    category: p.category as Product['category'],
    description: p.description,
    features,
    images: p.image ? [p.image] : [],
    inStock: p.inStock,
    sku: p.sku,
  }
}
