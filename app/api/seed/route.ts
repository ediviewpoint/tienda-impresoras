import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const brandsData = [
  { name: 'HP',        slug: 'hp',        color: '#1852D9' },
  { name: 'Epson',     slug: 'epson',     color: '#FF5722' },
  { name: 'Canon',     slug: 'canon',     color: '#16A34A' },
  { name: 'Brother',   slug: 'brother',   color: '#0F172A' },
  { name: 'Xerox',     slug: 'xerox',     color: '#E11D48' },
  { name: 'Bambu Lab', slug: 'bambu-lab', color: '#7C3AED' },
  { name: 'Creality',  slug: 'creality',  color: '#7C3AED' },
]

const categoriesData = [
  { name: 'Láser',          slug: 'laser',         description: 'Impresoras láser de alta velocidad' },
  { name: 'Inkjet',         slug: 'inkjet',         description: 'Impresoras de inyección de tinta' },
  { name: 'Multifuncional', slug: 'multifuncional', description: 'Imprime, copia y escanea' },
  { name: 'Impresoras 3D',  slug: '3d',             description: 'Fabricación aditiva FDM y resina' },
  { name: 'Tóner y Tinta',  slug: 'toner',          description: 'Consumibles originales y compatibles' },
  { name: 'Papel y Medios', slug: 'papel',          description: 'Papel fotográfico, bond y especialidad' },
  { name: 'Accesorios',     slug: 'accesorios',     description: 'Cables, bandejas y más' },
]

const productsData = [
  {
    slug: 'hp-laserjet-pro-4001dn',
    name: 'HP LaserJet Pro 4001dn Monocromática',
    brandSlug: 'hp', categorySlug: 'laser',
    price: 4299, originalPrice: 5999, rating: 5, reviewCount: 248, badge: 'best',
    description: 'Impresora láser profesional monocromática con conectividad Ethernet y doble cara automática.',
    features: JSON.stringify(['40 ppm', 'Ethernet + USB', 'Doble cara auto', '250 hojas', '3 años garantía']),
    images: ['https://placehold.co/600x400/1852D9/white?text=HP+LaserJet+Pro'],
    inStock: true, sku: 'HP-LJ4001DN',
  },
  {
    slug: 'epson-ecotank-l3250',
    name: 'Epson EcoTank L3250 Multifuncional Color WiFi',
    brandSlug: 'epson', categorySlug: 'multifuncional',
    price: 3599, originalPrice: 4200, rating: 4, reviewCount: 183, badge: 'new',
    description: 'Sistema de tinta continua con depósitos recargables. Imprime, copia y escanea con WiFi integrado.',
    features: JSON.stringify(['WiFi + USB', 'Imprime, copia, escanea', '33 ppm negro', '5760 dpi', 'Tinta recargable']),
    images: ['https://placehold.co/600x400/FF5722/white?text=Epson+EcoTank'],
    inStock: true, sku: 'EPS-L3250',
  },
  {
    slug: 'canon-pixma-g3160',
    name: 'Canon PIXMA G3160 Multifuncional Megatank WiFi',
    brandSlug: 'canon', categorySlug: 'multifuncional',
    price: 2899, originalPrice: 3800, rating: 5, reviewCount: 312, badge: 'sale',
    description: 'Impresora Megatank de bajo costo por página con WiFi y pantalla LCD.',
    features: JSON.stringify(['WiFi + USB', 'LCD integrado', 'Impresión a color', '4800 dpi', 'Tinta recargable']),
    images: ['https://placehold.co/600x400/16A34A/white?text=Canon+PIXMA'],
    inStock: true, sku: 'CAN-G3160',
  },
  {
    slug: 'bambu-lab-a1-mini-combo',
    name: 'Bambu Lab A1 Mini Combo 3D Printer + AMS Lite',
    brandSlug: 'bambu-lab', categorySlug: '3d',
    price: 12499, originalPrice: 14000, rating: 5, reviewCount: 97, badge: 'hot',
    description: 'Impresora 3D de alta velocidad multicolor con sistema AMS Lite incluido.',
    features: JSON.stringify(['4 colores simultáneos', '500 mm/s', 'WiFi + LAN', 'Auto-nivelación', 'Cámara integrada']),
    images: ['https://placehold.co/600x400/7C3AED/white?text=Bambu+Lab+A1'],
    inStock: true, sku: 'BAM-A1MINI',
  },
  {
    slug: 'brother-hl-l2350dw',
    name: 'Brother HL-L2350DW Láser Inalámbrica Doble Cara',
    brandSlug: 'brother', categorySlug: 'laser',
    price: 3199, originalPrice: 3900, rating: 4, reviewCount: 156, badge: 'sale',
    description: 'Impresora láser monocromática inalámbrica con doble cara automática para hogar y oficina.',
    features: JSON.stringify(['32 ppm', 'WiFi + USB', 'Doble cara auto', '250 hojas', 'Mobile print']),
    images: ['https://placehold.co/600x400/0F172A/white?text=Brother+HL-L2350'],
    inStock: true, sku: 'BRO-L2350DW',
  },
  {
    slug: 'hp-deskjet-2775',
    name: 'HP DeskJet 2775 Multifuncional Inalámbrica',
    brandSlug: 'hp', categorySlug: 'inkjet',
    price: 1299, originalPrice: 1700, rating: 4, reviewCount: 421, badge: 'best',
    description: 'Impresora multifuncional inalámbrica ideal para el hogar. Imprime, copia y escanea.',
    features: JSON.stringify(['WiFi + USB', 'Imprime, copia, escanea', '7.5 ppm color', '4800 dpi', 'HP Smart App']),
    images: ['https://placehold.co/600x400/1852D9/white?text=HP+DeskJet+2775'],
    inStock: true, sku: 'HP-DJ2775',
  },
  {
    slug: 'xerox-b210',
    name: 'Xerox B210 Láser Monocromática WiFi',
    brandSlug: 'xerox', categorySlug: 'laser',
    price: 2499, originalPrice: 3100, rating: 4, reviewCount: 88, badge: 'new',
    description: 'Impresora láser compacta con WiFi directo, impresión móvil y alta capacidad de papel.',
    features: JSON.stringify(['31 ppm', 'WiFi Direct', '251 hojas', 'Mobile print', 'USB 2.0']),
    images: ['https://placehold.co/600x400/E11D48/white?text=Xerox+B210'],
    inStock: true, sku: 'XER-B210',
  },
  {
    slug: 'creality-ender-3-v3',
    name: 'Creality Ender 3 V3 SE Impresora 3D FDM',
    brandSlug: 'creality', categorySlug: '3d',
    price: 4899, originalPrice: 5500, rating: 4, reviewCount: 134, badge: 'sale',
    description: 'Impresora 3D FDM de entrada de alta calidad con auto-nivelación CR Touch y pantalla táctil.',
    features: JSON.stringify(['250mm/s', 'Auto-nivelación', 'Pantalla táctil', 'Marco metálico', 'Fácil montaje']),
    images: ['https://placehold.co/600x400/7C3AED/white?text=Creality+Ender+3'],
    inStock: true, sku: 'CRE-E3V3SE',
  },
]

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const log: string[] = []

  // Brands
  const brandMap = new Map<string, string>()
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({ where: { slug: b.slug }, update: b, create: b })
    brandMap.set(b.slug, brand.id)
    log.push(`Brand: ${b.name}`)
  }

  // Categories
  const categoryMap = new Map<string, string>()
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c })
    categoryMap.set(c.slug, cat.id)
    log.push(`Category: ${c.name}`)
  }

  // Products
  for (const p of productsData) {
    const brandId = brandMap.get(p.brandSlug)!
    const categoryId = categoryMap.get(p.categorySlug)!
    const { brandSlug, categorySlug, images, ...rest } = p

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...rest, brandId, categoryId },
      create: { ...rest, brandId, categoryId },
    })

    await prisma.productImage.deleteMany({ where: { productId: product.id } })
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({ data: { url: images[i], order: i, productId: product.id } })
    }

    log.push(`Product: ${p.name}`)
  }

  return NextResponse.json({ ok: true, seeded: log })
}
