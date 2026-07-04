import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma/client'

function createPrisma() {
  const url = process.env.DATABASE_URL ?? ''

  if (url.startsWith('file:') || url === '') {
    const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
    const adapter = new PrismaBetterSqlite3({ url: url || 'file:./dev.db' })
    return new PrismaClient({ adapter })
  }

  const { Pool } = require('@neondatabase/serverless')
  const { PrismaNeon } = require('@prisma/adapter-neon')
  const pool = new Pool({ connectionString: url })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

const prisma = createPrisma()

const products = [
  {
    slug: 'hp-laserjet-pro-4001dn',
    name: 'HP LaserJet Pro 4001dn Monocromática',
    brand: 'HP',
    brandColor: '#1852D9',
    price: 4299,
    originalPrice: 5999,
    rating: 5,
    reviewCount: 248,
    badge: 'best',
    category: 'laser',
    description: 'Impresora láser profesional monocromática con conectividad Ethernet y doble cara automática.',
    features: JSON.stringify(['40 ppm', 'Ethernet + USB', 'Doble cara auto', '250 hojas', '3 años garantía']),
    image: 'https://placehold.co/600x400/1852D9/white?text=HP+LaserJet+Pro',
    inStock: true,
    sku: 'HP-LJ4001DN',
  },
  {
    slug: 'epson-ecotank-l3250',
    name: 'Epson EcoTank L3250 Multifuncional Color WiFi',
    brand: 'Epson',
    brandColor: '#FF5722',
    price: 3599,
    originalPrice: 4200,
    rating: 4,
    reviewCount: 183,
    badge: 'new',
    category: 'multifuncional',
    description: 'Sistema de tinta continua con depósitos recargables. Imprime, copia y escanea con WiFi integrado.',
    features: JSON.stringify(['WiFi + USB', 'Imprime, copia, escanea', '33 ppm negro', '5760 dpi', 'Tinta recargable']),
    image: 'https://placehold.co/600x400/FF5722/white?text=Epson+EcoTank',
    inStock: true,
    sku: 'EPS-L3250',
  },
  {
    slug: 'canon-pixma-g3160',
    name: 'Canon PIXMA G3160 Multifuncional Megatank WiFi',
    brand: 'Canon',
    brandColor: '#16A34A',
    price: 2899,
    originalPrice: 3800,
    rating: 5,
    reviewCount: 312,
    badge: 'sale',
    category: 'multifuncional',
    description: 'Impresora Megatank de bajo costo por página con WiFi y pantalla LCD.',
    features: JSON.stringify(['WiFi + USB', 'LCD integrado', 'Impresión a color', '4800 dpi', 'Tinta recargable']),
    image: 'https://placehold.co/600x400/16A34A/white?text=Canon+PIXMA',
    inStock: true,
    sku: 'CAN-G3160',
  },
  {
    slug: 'bambu-lab-a1-mini-combo',
    name: 'Bambu Lab A1 Mini Combo 3D Printer + AMS Lite',
    brand: 'Bambu Lab',
    brandColor: '#7C3AED',
    price: 12499,
    originalPrice: 14000,
    rating: 5,
    reviewCount: 97,
    badge: 'hot',
    category: '3d',
    description: 'Impresora 3D de alta velocidad multicolor con sistema AMS Lite incluido.',
    features: JSON.stringify(['4 colores simultáneos', '500 mm/s', 'WiFi + LAN', 'Auto-nivelación', 'Cámara integrada']),
    image: 'https://placehold.co/600x400/7C3AED/white?text=Bambu+Lab+A1',
    inStock: true,
    sku: 'BAM-A1MINI',
  },
  {
    slug: 'brother-hl-l2350dw',
    name: 'Brother HL-L2350DW Láser Inalámbrica Doble Cara',
    brand: 'Brother',
    brandColor: '#1852D9',
    price: 3199,
    originalPrice: 3900,
    rating: 4,
    reviewCount: 156,
    badge: 'sale',
    category: 'laser',
    description: 'Impresora láser monocromática inalámbrica con doble cara automática para hogar y oficina.',
    features: JSON.stringify(['32 ppm', 'WiFi + USB', 'Doble cara auto', '250 hojas', 'Mobile print']),
    image: 'https://placehold.co/600x400/1852D9/white?text=Brother+HL-L2350',
    inStock: true,
    sku: 'BRO-L2350DW',
  },
  {
    slug: 'hp-deskjet-2775',
    name: 'HP DeskJet 2775 Multifuncional Inalámbrica',
    brand: 'HP',
    brandColor: '#1852D9',
    price: 1299,
    originalPrice: 1700,
    rating: 4,
    reviewCount: 421,
    badge: 'best',
    category: 'inkjet',
    description: 'Impresora multifuncional inalámbrica ideal para el hogar. Imprime, copia y escanea.',
    features: JSON.stringify(['WiFi + USB', 'Imprime, copia, escanea', '7.5 ppm color', '4800 dpi', 'HP Smart App']),
    image: 'https://placehold.co/600x400/1852D9/white?text=HP+DeskJet+2775',
    inStock: true,
    sku: 'HP-DJ2775',
  },
  {
    slug: 'xerox-b210',
    name: 'Xerox B210 Láser Monocromática WiFi',
    brand: 'Xerox',
    brandColor: '#1852D9',
    price: 2499,
    originalPrice: 3100,
    rating: 4,
    reviewCount: 88,
    badge: 'new',
    category: 'laser',
    description: 'Impresora láser compacta con WiFi directo, impresión móvil y alta capacidad de papel.',
    features: JSON.stringify(['31 ppm', 'WiFi Direct', '251 hojas', 'Mobile print', 'USB 2.0']),
    image: 'https://placehold.co/600x400/1852D9/white?text=Xerox+B210',
    inStock: true,
    sku: 'XER-B210',
  },
  {
    slug: 'creality-ender-3-v3',
    name: 'Creality Ender 3 V3 SE Impresora 3D FDM',
    brand: 'Creality',
    brandColor: '#7C3AED',
    price: 4899,
    originalPrice: 5500,
    rating: 4,
    reviewCount: 134,
    badge: 'sale',
    category: '3d',
    description: 'Impresora 3D FDM de entrada de alta calidad con auto-nivelación CR Touch y pantalla táctil.',
    features: JSON.stringify(['250mm/s', 'Auto-nivelación', 'Pantalla táctil', 'Marco metálico', 'Fácil montaje']),
    image: 'https://placehold.co/600x400/7C3AED/white?text=Creality+Ender+3',
    inStock: true,
    sku: 'CRE-E3V3SE',
  },
]

async function main() {
  console.log('🌱 Seeding database...')
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
    console.log(`  ✓ ${product.name}`)
  }
  console.log(`\n✅ ${products.length} productos insertados.`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
