export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  brandColor?: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  badge?: 'new' | 'sale' | 'hot' | 'best'
  category: ProductCategory
  description: string
  features: string[]
  images: string[]
  inStock: boolean
  sku: string
}

export type ProductCategory =
  | 'laser'
  | 'inkjet'
  | 'multifuncional'
  | '3d'
  | 'toner'
  | 'papel'
  | 'accesorios'

export interface Category {
  id: ProductCategory
  label: string
  count: number
  color: string
  bgColor: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  total: number
  count: number
}
