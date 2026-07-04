'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useStore, useCartTotal } from '@/lib/store/useStore'
import { formatPrice } from '@/lib/utils'
import dynamic from 'next/dynamic'
import type { CartItem } from '@/lib/store/useStore'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

const DownloadReceiptButton = dynamic(
  () => import('@/components/pdf/DownloadReceiptButton').then(m => m.DownloadReceiptButton),
  { ssr: false, loading: () => null }
)

const PayPalButton = dynamic(
  () => import('@/components/checkout/PayPalButton').then(m => m.PayPalButton),
  { ssr: false, loading: () => <div className="h-12 bg-gray-100 rounded-full animate-pulse" /> }
)

const PAYMENT_METHODS = [
  { id: 'paypal', icon: '🅿️', label: 'PayPal' },
  { id: 'spei',   icon: '🏦', label: 'SPEI / QR' },
  { id: 'manual', icon: '📱', label: 'WhatsApp' },
]

const SPEI_INFO = {
  banco: 'BBVA',
  clabe: '012 180 0012 3456 7890 1',
  beneficiario: 'PrintMax S.A. de C.V.',
  concepto: 'Pago pedido PrintMax',
}

// ── Zod schema ────────────────────────────────────────────────────────────────
const checkoutSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un email válido'),
  telefono: z.string().regex(/^(\+?[\d\s\-()]{7,15})?$/, 'Teléfono inválido').optional().or(z.literal('')),
  cp: z.string().regex(/^(\d{5})?$/, 'Código postal: 5 dígitos').optional().or(z.literal('')),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  estado: z.string().optional(),
  paymentMethod: z.enum(['paypal', 'spei', 'manual']),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

interface OrderResult { orderNumber: string; id: string }

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className="text-xs text-red-500 mt-0.5">{msg}</p>
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const items = useStore(s => s.items)
  const tieneFactura = useStore(s => s.tieneFactura)
  const getPrecio = useStore(s => s.getPrecio)
  const clear = useStore(s => s.clear)
  const total = useCartTotal()

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])
  useEffect(() => {
    if (hydrated && items.length === 0) router.replace('/carrito')
    // router is stable in Next.js App Router — intentionally omitted from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, items.length])

  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)
  const [snapshotItems, setSnapshotItems] = useState<CartItem[]>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      nombre: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
      telefono: '',
      cp: '',
      direccion: '',
      ciudad: '',
      estado: '',
      paymentMethod: 'paypal',
    },
  })

  const paymentMethod = watch('paymentMethod')
  const nombre = watch('nombre')
  const email = watch('email')

  const shipping = total >= 800 ? 0 : 150
  const grandTotal = total + shipping

  async function saveOrder(formData: CheckoutForm, paypalOrderId?: string) {
    setSaving(true)
    try {
      const res = await fetch('/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.nombre,
          clientEmail: formData.email,
          clientPhone: formData.telefono || null,
          clientAddress: formData.direccion || null,
          clientCity: formData.ciudad || null,
          clientState: formData.estado || null,
          clientZip: formData.cp || null,
          paymentMethod: formData.paymentMethod,
          tieneFactura,
          subtotal: total,
          shipping,
          status: paypalOrderId ? 'confirmado' : 'pendiente',
          notes: paypalOrderId ? `PayPal ID: ${paypalOrderId}` : null,
          userId: session?.user?.id ?? null,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
            unitPrice: getPrecio(product.price),
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al confirmar pedido')
      setSnapshotItems([...items])
      setOrderResult({ orderNumber: data.order.orderNumber, id: data.order.id })
      clear()
      setDone(true)
      return data.order
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al confirmar pedido')
      return false
    } finally {
      setSaving(false)
    }
  }

  function buildWhatsAppMessage(formData: CheckoutForm, orderNum: string) {
    const lines = [
      `*Nuevo pedido PrintMax — ${orderNum}*`,
      ``,
      `*Cliente:* ${formData.nombre}`,
      `*Email:* ${formData.email}`,
      formData.telefono ? `*Tel:* ${formData.telefono}` : null,
      formData.direccion ? `*Dirección:* ${formData.direccion}, ${formData.ciudad} ${formData.cp}` : null,
      ``,
      `*Productos:*`,
      ...items.map(({ product, quantity }) =>
        `• ${product.name} ×${quantity} — ${formatPrice(getPrecio(product.price) * quantity)}`
      ),
      ``,
      `*Subtotal:* ${formatPrice(total)}`,
      `*Envío:* ${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}`,
      `*Total:* ${formatPrice(grandTotal)}`,
      `*Factura:* ${tieneFactura ? 'Con factura' : 'Sin factura'}`,
    ].filter(Boolean)
    return encodeURIComponent(lines.join('\n'))
  }

  // ── Success screen ────────────────────────────────────────────────────────────
  if (done && orderResult) {
    const isWhatsApp = paymentMethod === 'manual'
    const isSPEI = paymentMethod === 'spei'
    const formSnap = { nombre, email, telefono: watch('telefono'), direccion: watch('direccion'), ciudad: watch('ciudad'), cp: watch('cp'), estado: watch('estado'), paymentMethod }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto px-6 mt-20 text-center space-y-4"
      >
        <div className="text-6xl">{isWhatsApp ? '📱' : isSPEI ? '🏦' : '✅'}</div>
        <h2 className="text-2xl font-extrabold text-gray-900">
          {isWhatsApp ? '¡Pedido registrado!' : isSPEI ? '¡Pedido registrado!' : '¡Pago confirmado!'}
        </h2>
        <p className="text-gray-500 font-mono text-sm">#{orderResult.orderNumber}</p>

        {isWhatsApp && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-5 text-left space-y-3">
            <p className="font-bold text-gray-900">Siguiente paso:</p>
            <p className="text-sm text-gray-600">Envía tu pedido por WhatsApp para coordinar la entrega y pago.</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '521XXXXXXXXXX'}?text=${buildWhatsAppMessage(formSnap as CheckoutForm, orderResult.orderNumber)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[#25D366] text-white font-bold text-sm hover:bg-[#20BA5A] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.554 4.103 1.524 5.826L.057 23.985l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.032-1.378l-.361-.214-3.741.981 1-3.641-.235-.374A9.86 9.86 0 012.118 12C2.118 6.539 6.539 2.118 12 2.118c5.462 0 9.882 4.421 9.882 9.882 0 5.462-4.42 9.882-9.882 9.882z"/></svg>
              Enviar pedido por WhatsApp
            </a>
          </div>
        )}

        {isSPEI && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-left space-y-3">
            <p className="font-bold text-gray-900">Realiza tu transferencia SPEI:</p>
            <div className="space-y-2 text-sm">
              {Object.entries(SPEI_INFO).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500 capitalize">{k}:</span>
                  <span className="font-semibold text-gray-900 font-mono">{v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 border-t border-blue-100">
                <span className="text-gray-500">Monto exacto:</span>
                <span className="font-extrabold text-[#1852D9]">{formatPrice(grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Referencia:</span>
                <span className="font-semibold font-mono">{orderResult.orderNumber}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">Tu pedido se procesará al confirmar el pago (1-2 horas hábiles).</p>
          </div>
        )}

        <DownloadReceiptButton
          orderNumber={orderResult.orderNumber}
          clientName={nombre}
          clientEmail={email}
          items={snapshotItems}
          tieneFactura={tieneFactura}
        />
        <a href="/" className="inline-flex h-11 px-8 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm items-center gap-2 hover:bg-gray-50 transition-colors">
          Volver al inicio
        </a>
      </motion.div>
    )
  }

  // ── Checkout form ─────────────────────────────────────────────────────────────
  const inputCls = (hasError?: boolean) =>
    `w-full h-10 border rounded-lg px-3 text-sm outline-none transition-all ${
      hasError ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#1852D9]'
    }`

  return (
    <div className="max-w-5xl mx-auto px-6 mt-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-7">Checkout</h1>

      <div className="grid grid-cols-[1fr_360px] gap-8">
        <div className="space-y-5">
          {/* Shipping form */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Datos de envío</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Nombre *</label>
                <input {...register('nombre')} className={inputCls(!!errors.nombre)} />
                <FieldError msg={errors.nombre?.message} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Email *</label>
                <input type="email" {...register('email')} className={inputCls(!!errors.email)} />
                <FieldError msg={errors.email?.message} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Teléfono</label>
                <input type="tel" {...register('telefono')} placeholder="55 1234 5678" className={inputCls(!!errors.telefono)} />
                <FieldError msg={errors.telefono?.message} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Código Postal</label>
                <input {...register('cp')} placeholder="06600" className={inputCls(!!errors.cp)} maxLength={5} />
                <FieldError msg={errors.cp?.message} />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Dirección</label>
                <input {...register('direccion')} placeholder="Calle, número, colonia" className={inputCls()} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Ciudad</label>
                <input {...register('ciudad')} placeholder="Ciudad de México" className={inputCls()} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Estado</label>
                <input {...register('estado')} placeholder="CDMX" className={inputCls()} />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Método de pago</h3>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {PAYMENT_METHODS.map(({ id, icon, label }) => (
                <label
                  key={id}
                  className={`flex flex-col items-center gap-2 border rounded-xl p-4 cursor-pointer transition-colors ${
                    paymentMethod === id ? 'border-[#1852D9] bg-blue-50' : 'border-gray-200 hover:border-[#1852D9]'
                  }`}
                >
                  <input type="radio" {...register('paymentMethod')} value={id} className="sr-only" />
                  <span className="text-2xl">{icon}</span>
                  <span className="text-xs font-semibold text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <AnimatePresence>
              {paymentMethod === 'spei' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 rounded-xl p-4 text-sm space-y-2">
                  <p className="font-bold text-gray-800 text-xs uppercase tracking-wide mb-2">Datos de transferencia</p>
                  {Object.entries(SPEI_INFO).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-500 capitalize">{k}:</span>
                      <span className="font-semibold font-mono text-gray-800">{v}</span>
                    </div>
                  ))}
                </motion.div>
              )}
              {paymentMethod === 'manual' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 rounded-xl p-4 text-sm text-gray-600">
                  Se registrará tu pedido y recibirás un mensaje de WhatsApp para coordinar el pago y la entrega.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PayPal */}
          {paymentMethod === 'paypal' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Pagar con PayPal</h3>
              {(!nombre || !email) ? (
                <p className="text-sm text-gray-400">Completa tu nombre y email para continuar.</p>
              ) : (
                <PayPalButton
                  amount={grandTotal.toFixed(2)}
                  onSuccess={async (paypalId) => {
                    handleSubmit(data => saveOrder(data, paypalId))()
                  }}
                  onError={() => alert('Error al procesar el pago con PayPal. Intenta de nuevo.')}
                />
              )}
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 h-fit">
          <h3 className="font-extrabold text-lg text-gray-900 mb-4">Tu pedido</h3>
          <div className="space-y-2 text-sm mb-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between">
                <span className="text-gray-600 line-clamp-1 flex-1 pr-2">{product.name} ×{quantity}</span>
                <AnimatePresence mode="wait">
                  <motion.span key={`${product.id}-${tieneFactura}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold flex-shrink-0">
                    {formatPrice(getPrecio(product.price) * quantity)}
                  </motion.span>
                </AnimatePresence>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Envío</span>
              <span className={shipping === 0 ? 'text-emerald-600 font-semibold' : ''}>
                {shipping === 0 ? 'GRATIS' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-gray-900 text-base pt-1">
              <span>Total</span>
              <AnimatePresence mode="wait">
                <motion.span key={`${grandTotal}-${tieneFactura}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
                  {formatPrice(grandTotal)}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="text-xs text-gray-400">{tieneFactura ? 'Con factura (IVA incluido)' : 'Sin factura (precio neto)'}</p>
          </div>

          {paymentMethod !== 'paypal' && (
            <button
              onClick={handleSubmit(data => saveOrder(data))}
              disabled={saving || items.length === 0}
              className="mt-5 w-full h-12 rounded-full bg-[#FF5722] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#E64A19] transition-colors shadow-[0_4px_16px_rgba(255,87,34,.35)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Procesando…' : paymentMethod === 'manual' ? '📱 Confirmar y abrir WhatsApp' : '🏦 Confirmar y obtener CLABE'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
