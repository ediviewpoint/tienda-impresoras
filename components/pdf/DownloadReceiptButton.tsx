'use client'

import dynamic from 'next/dynamic'
import { useStore } from '@/lib/store/useStore'
import type { CartItem } from '@/lib/types'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false, loading: () => null }
)

const Receipt = dynamic(
  () => import('./Receipt').then(m => m.Receipt),
  { ssr: false }
)

interface Props {
  orderNumber: string
  clientName?: string
  clientEmail?: string
  items?: CartItem[]
  tieneFactura?: boolean
}

export function DownloadReceiptButton({ orderNumber, clientName, clientEmail, items: itemsProp, tieneFactura: facturaProp }: Props) {
  const storeItems = useStore(s => s.items)
  const storeTieneFactura = useStore(s => s.tieneFactura)
  const getPrecio = useStore(s => s.getPrecio)

  const items = itemsProp ?? storeItems
  const tieneFactura = facturaProp ?? storeTieneFactura

  if (!items.length) return null

  return (
    <PDFDownloadLink
      document={
        <Receipt
          items={items}
          tieneFactura={tieneFactura}
          getPrecio={getPrecio}
          orderNumber={orderNumber}
          clientName={clientName}
          clientEmail={clientEmail}
        />
      }
      fileName={`printmax-recibo-${orderNumber}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="w-full h-12 rounded-full bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors disabled:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {loading ? 'Generando PDF…' : 'Descargar recibo PDF'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
