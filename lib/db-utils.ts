import type {
  Product as PrismaProduct,
  Brand,
  Category,
  ProductImage,
} from '@/lib/generated/prisma/client'
import type { Product } from '@/lib/types/index'

export type PrismaProductFull = PrismaProduct & {
  brand: Brand
  category: Category
  images: ProductImage[]
}

export function dbToUIProduct(p: PrismaProductFull): Product {
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
    brand: p.brand.name,
    brandColor: p.brand.color,
    price: p.price,
    originalPrice: p.originalPrice ?? undefined,
    rating: p.rating,
    reviewCount: p.reviewCount,
    badge: (p.badge as Product['badge']) ?? undefined,
    category: p.category.slug as Product['category'],
    description: p.description,
    features,
    images: [...p.images].sort((a, b) => a.order - b.order).map(i => i.url),
    inStock: p.inStock,
    sku: p.sku,
  }
}

export const PRODUCT_INCLUDE = {
  brand: true,
  category: true,
  images: { orderBy: { order: 'asc' as const } },
} as const
