'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Cpu, MemoryStick, HardDrive, Monitor, Wifi, Printer,
  Battery, Settings, Usb, Camera, Zap, Package,
  ShieldCheck, BadgeCheck, MapPin, Truck,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { Product } from '@/lib/types'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { AnimatedPrice } from '@/components/ui/AnimatedPrice'
import { ModelViewer3D } from '@/components/product/ModelViewer3D'
import { ProductGallery } from '@/components/product/ProductGallery'
import { useStore } from '@/lib/store/useStore'
import { useToastStore } from '@/lib/store/useToastStore'

// ── Spec icon mapping ───────────────────────────────────────────────────────
type IconComponent = React.ComponentType<LucideProps>

const SPEC_MAP: { keywords: string[]; Icon: IconComponent }[] = [
  { keywords: ['procesador', 'cpu', 'intel', 'amd', 'ryzen', 'core i'],      Icon: Cpu         },
  { keywords: ['ram', 'memoria'],                                              Icon: MemoryStick },
  { keywords: ['almacenamiento', 'disco', 'ssd', 'hdd', 'nvme', 'storage'],  Icon: HardDrive   },
  { keywords: ['pantalla', 'display', 'pulgada', 'resolución', 'resolucion'], Icon: Monitor     },
  { keywords: ['conectividad', 'wifi', 'red', 'ethernet', 'bluetooth'],       Icon: Wifi        },
  { keywords: ['impresión', 'impresion', 'velocidad', 'ppm', 'dpi'],          Icon: Printer     },
  { keywords: ['batería', 'bateria', 'autonomía', 'autonomia'],               Icon: Battery     },
  { keywords: ['sistema', 'so', 'windows', 'android', 'software', 'os'],     Icon: Settings    },
  { keywords: ['puerto', 'usb', 'hdmi', 'conexión', 'conexion'],             Icon: Usb         },
  { keywords: ['cámara', 'camara', 'webcam'],                                Icon: Camera      },
  { keywords: ['peso', 'dimensiones', 'tamaño'],                             Icon: Package     },
]

function getSpecIcon(label: string): IconComponent {
  const lower = label.toLowerCase()
  return SPEC_MAP.find(({ keywords }) => keywords.some(k => lower.includes(k)))?.Icon ?? Zap
}

function parseSpec(f: string): { label: string; value: string } {
  const idx = f.indexOf(':')
  if (idx === -1) return { label: '', value: f.trim() }
  return { label: f.slice(0, idx).trim(), value: f.slice(idx + 1).trim() }
}

// ── Trust items ─────────────────────────────────────────────────────────────
const TRUST_ITEMS: { Icon: IconComponent; text: string }[] = [
  { Icon: ShieldCheck, text: 'Producto nuevo y sellado' },
  { Icon: BadgeCheck,  text: 'Garantía incluida'        },
  { Icon: MapPin,      text: 'Entrega en Santa Cruz'    },
  { Icon: Truck,       text: 'Envíos a todo Bolivia'    },
]

// ── Component ───────────────────────────────────────────────────────────────
const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '591XXXXXXXXX'

export function ProductDetail({ product }: { product: Product }) {
  const add          = useStore(s => s.add)
  const tieneFactura = useStore(s => s.tieneFactura)
  const push         = useToastStore(s => s.push)
  const [added, setAdded] = useState(false)
  const [qty, setQty]     = useState(1)
  const [tab, setTab]     = useState<'images' | '3d'>('images')

  const color      = product.brandColor ?? '#1852D9'
  const outOfStock = !product.inStock || product.stock === 0

  function handleAdd() {
    for (let i = 0; i < qty; i++) add(product)
    push(`${product.name.substring(0, 28)}… agregado al carrito`)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const waText = encodeURIComponent(`Hola PrintMax, quisiera consultar sobre: *${product.name}*`)

  return (
    /* pb-24 lg:pb-0 deja espacio para la sticky bar en mobile */
    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pb-24 lg:pb-0">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* ── Izquierda — Galería / 3D ───────────────── */}
        <div>
          <div className="flex gap-2 mb-4">
            {(['images', '3d'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors ${
                  tab === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {t === 'images' ? '📷 Imágenes' : '🧊 Vista 3D'}
              </button>
            ))}
          </div>

          {tab === 'images' ? (
            product.images.length > 0 ? (
              <ProductGallery images={product.images} alt={product.name} />
            ) : (
              <div
                className="rounded-xl flex items-center justify-center min-h-[280px] sm:min-h-[360px]"
                style={{ background: `linear-gradient(135deg, ${color}15, ${color}08)` }}
              >
                <svg width="180" height="180" viewBox="0 0 120 120" fill="none">
                  <rect x="15" y="40" width="90" height="50" rx="6" fill={color} fillOpacity="0.2" stroke={color} strokeOpacity="0.35" strokeWidth="1.5"/>
                  <rect x="25" y="20" width="70" height="24" rx="4" fill={color} fillOpacity="0.12" stroke={color} strokeOpacity="0.3" strokeWidth="1.5"/>
                  <rect x="35" y="27" width="50" height="2.5" rx="1.25" fill={color} fillOpacity="0.5"/>
                  <rect x="35" y="33" width="35" height="2.5" rx="1.25" fill={color} fillOpacity="0.35"/>
                  <rect x="25" y="88" width="70" height="10" rx="3" fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.25" strokeWidth="1.5"/>
                  <rect x="40" y="82" width="40" height="8" rx="2" fill={color} fillOpacity="0.3"/>
                  <circle cx="88" cy="60" r="5" fill={color} fillOpacity="0.45"/>
                </svg>
              </div>
            )
          ) : (
            <ModelViewer3D src="" alt={product.name} />
          )}
        </div>

        {/* ── Derecha — Info ─────────────────────────── */}
        <div className="flex flex-col">
          {product.badge && (
            <div className="mb-3"><Badge variant={product.badge} /></div>
          )}

          <p className="text-sm font-bold uppercase tracking-wider mb-1.5" style={{ color }}>
            {product.brand} · SKU: {product.sku}
          </p>

          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug mb-3">
            {product.name}
          </h1>

          <StarRating rating={product.rating} count={product.reviewCount} />

          {/* Precio */}
          <div className="mt-4">
            <AnimatedPrice basePrice={product.price} originalPrice={product.originalPrice} size="lg" />
            <p className="text-xs text-gray-400 mt-1">
              Precio {tieneFactura ? 'con IVA incluido (C/F)' : 'sin IVA (S/F)'}
            </p>
          </div>

          {/* Descripción */}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-5 whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Especificaciones técnicas con íconos */}
          {product.features.length > 0 && (
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                Especificaciones
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((f, i) => {
                  const { label, value } = parseSpec(f)
                  const Icon = getSpecIcon(label || value)
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}15`, color }}
                      >
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0">
                        {label && (
                          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 leading-none mb-0.5">
                            {label}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-gray-800 leading-snug truncate">
                          {value}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Stock badges */}
          {product.inStock && product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 w-fit mb-3">
              Quedan {product.stock} unidades
            </p>
          )}
          {outOfStock && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-3 py-1 w-fit mb-3">
              Agotado
            </p>
          )}

          {/* CTA desktop */}
          <div className="hidden lg:flex items-center gap-3 mt-auto">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={outOfStock}
                className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-lg disabled:opacity-40"
              >−</button>
              <span className="w-10 text-center font-bold text-sm">{qty}</span>
              <button
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                disabled={outOfStock || qty >= product.stock}
                className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-lg disabled:opacity-40"
              >+</button>
            </div>
            <motion.button
              onClick={handleAdd}
              whileTap={outOfStock ? {} : { scale: 0.97 }}
              disabled={outOfStock}
              className={`flex-1 h-11 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                outOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : added ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {outOfStock ? 'Sin stock' : added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </motion.button>
          </div>

          {/* Selector de cantidad mobile */}
          <div className="flex lg:hidden items-center gap-3 mt-4">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} disabled={outOfStock} className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-lg disabled:opacity-40">−</button>
              <span className="w-10 text-center font-bold text-sm">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={outOfStock || qty >= product.stock} className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-lg disabled:opacity-40">+</button>
            </div>
            <p className="text-xs text-gray-400">Cantidad (el botón está abajo)</p>
          </div>

          {/* ── Franja de confianza ───────────────────── */}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-x-4 gap-y-3">
            {TRUST_ITEMS.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <Icon size={14} className="text-primary shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Compartir */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 self-center">Compartir:</p>
            {[
              { label: 'WhatsApp', color: 'var(--color-whatsapp)', href: `https://wa.me/?text=${encodeURIComponent(product.name + ' — PrintMax')}` },
              { label: 'Facebook', color: '#1877F2',               href: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://printmax.bo'}/producto/${product.slug}`)}` },
            ].map(({ label, color: c, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3 rounded-full text-white text-[11px] font-bold flex items-center transition-opacity hover:opacity-85"
                style={{ background: c }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar mobile ──────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <AnimatedPrice basePrice={product.price} originalPrice={product.originalPrice} size="md" />
          <p className="text-[10px] text-gray-400 truncate">{product.name}</p>
        </div>
        <motion.button
          onClick={handleAdd}
          whileTap={outOfStock ? {} : { scale: 0.97 }}
          disabled={outOfStock}
          className={`h-12 px-5 rounded-full font-bold text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            outOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : added ? 'bg-success text-white' : 'bg-primary text-white'
          }`}
        >
          {outOfStock ? 'Agotado' : added ? '✓ Listo' : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Al carrito
            </>
          )}
        </motion.button>
        <a
          href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Consultar por WhatsApp"
          className="w-12 h-12 rounded-full bg-whatsapp text-white flex items-center justify-center shrink-0 hover:bg-whatsapp-dark transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.826L.057 23.985l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.032-1.378l-.361-.214-3.741.981 1-3.641-.235-.374A9.86 9.86 0 012.118 12C2.118 6.539 6.539 2.118 12 2.118c5.462 0 9.882 4.421 9.882 9.882 0 5.462-4.42 9.882-9.882 9.882z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}
