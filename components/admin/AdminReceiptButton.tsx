'use client'

import dynamic from 'next/dynamic'
import type { Order, OrderItem, Product } from '@/lib/generated/prisma/client'

export type FullOrder = Order & { items: (OrderItem & { product: Product })[] }

// Both must be dynamically imported — react-pdf cannot run on the server
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false, loading: () => null }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AdminReceipt = dynamic<any>(
  () => import('./AdminReceipt').then(m => m.AdminReceipt),
  { ssr: false }
)

export function AdminReceiptButton({ order }: { order: FullOrder }) {
  return (
    <PDFDownloadLink
      document={<AdminReceipt order={order} />}
      fileName={`printmax-recibo-${order.orderNumber}.pdf`}
    >
      {({ loading }: { loading: boolean }) => (
        <button
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors disabled:opacity-60"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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
