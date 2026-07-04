import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import { CartItem } from '@/lib/store/useStore'

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff',
})

const s = StyleSheet.create({
  page:        { fontFamily: 'Inter', padding: 40, fontSize: 10, color: '#1a1a2e', backgroundColor: '#fff' },
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  logo:        { fontSize: 22, fontWeight: 'bold', color: '#1852D9' },
  logoSub:     { fontSize: 9, color: '#888', marginTop: 2 },
  headerRight: { textAlign: 'right' },
  receiptNo:   { fontSize: 14, fontWeight: 'bold' },
  date:        { color: '#888', marginTop: 2 },
  divider:     { borderBottom: '1px solid #E2E8F0', marginVertical: 16 },
  section:     { marginBottom: 16 },
  sectionTitle:{ fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#888', letterSpacing: 1, marginBottom: 8 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label:       { color: '#555' },
  value:       { fontWeight: 'bold' },
  tableHead:   { flexDirection: 'row', backgroundColor: '#F4F6FC', padding: '8 10', borderRadius: 4, marginBottom: 4 },
  tableRow:    { flexDirection: 'row', padding: '7 10', borderBottom: '1px solid #F1F5F9' },
  col1:        { flex: 3 },
  col2:        { flex: 1, textAlign: 'center' },
  col3:        { flex: 1, textAlign: 'right' },
  totalBox:    { backgroundColor: '#1852D9', color: '#fff', padding: '12 16', borderRadius: 8, marginTop: 16 },
  totalLabel:  { fontSize: 11, opacity: 0.8 },
  totalAmt:    { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  policy:      { fontSize: 8, color: '#999', lineHeight: 1.6, marginTop: 24, borderTop: '1px solid #E2E8F0', paddingTop: 16 },
  policyTitle: { fontWeight: 'bold', color: '#555', marginBottom: 4 },
  badge:       { backgroundColor: '#EDFDF6', color: '#16A34A', padding: '3 8', borderRadius: 4, fontSize: 8, fontWeight: 'bold', alignSelf: 'flex-start' },
})

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

interface ReceiptProps {
  items: CartItem[]
  tieneFactura: boolean
  getPrecio: (p: number) => number
  orderNumber: string
  clientName?: string
  clientEmail?: string
}

export function Receipt({ items, tieneFactura, getPrecio, orderNumber, clientName, clientEmail }: ReceiptProps) {
  const subtotal = items.reduce((t, i) => t + getPrecio(i.product.price) * i.quantity, 0)
  const shipping = subtotal >= 800 ? 0 : 150
  const iva = tieneFactura ? subtotal * 0.16 : 0
  const total = subtotal + shipping

  const date = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.logo}>PrintMax</Text>
            <Text style={s.logoSub}>Tu tienda de impresoras · printmax.mx</Text>
            <Text style={s.logoSub}>RFC: PMX123456ABC · printmax@email.com</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.receiptNo}>RECIBO #{orderNumber}</Text>
            <Text style={s.date}>{date}</Text>
            <View style={{ ...s.badge, marginTop: 8 }}>
              <Text>{tieneFactura ? '✓ Con factura (IVA incluido)' : 'Sin factura'}</Text>
            </View>
          </View>
        </View>

        <View style={s.divider} />

        {/* Client data */}
        {(clientName || clientEmail) && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Datos del cliente</Text>
            {clientName && <View style={s.row}><Text style={s.label}>Nombre</Text><Text style={s.value}>{clientName}</Text></View>}
            {clientEmail && <View style={s.row}><Text style={s.label}>Email</Text><Text style={s.value}>{clientEmail}</Text></View>}
          </View>
        )}

        {/* Products table */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Productos</Text>
          <View style={s.tableHead}>
            <Text style={{ ...s.col1, fontWeight: 'bold' }}>Producto</Text>
            <Text style={{ ...s.col2, fontWeight: 'bold' }}>Cant.</Text>
            <Text style={{ ...s.col3, fontWeight: 'bold' }}>Precio</Text>
          </View>
          {items.map(({ product, quantity }) => (
            <View key={product.id} style={s.tableRow}>
              <View style={s.col1}>
                <Text style={{ fontWeight: 'bold' }}>{product.name}</Text>
                <Text style={{ color: '#888', fontSize: 8, marginTop: 1 }}>{product.brand} · SKU: {product.sku}</Text>
              </View>
              <Text style={s.col2}>{quantity}</Text>
              <Text style={s.col3}>{fmt(getPrecio(product.price) * quantity)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.section}>
          <View style={s.row}><Text style={s.label}>Subtotal</Text><Text>{fmt(subtotal)}</Text></View>
          <View style={s.row}>
            <Text style={s.label}>Envío</Text>
            <Text style={{ color: '#16A34A' }}>{shipping === 0 ? 'GRATIS' : fmt(shipping)}</Text>
          </View>
          {tieneFactura && (
            <View style={s.row}><Text style={s.label}>IVA (16%)</Text><Text>{fmt(iva)}</Text></View>
          )}
        </View>

        <View style={s.totalBox}>
          <Text style={s.totalLabel}>TOTAL A PAGAR</Text>
          <Text style={s.totalAmt}>{fmt(total)}</Text>
          <Text style={{ ...s.totalLabel, fontSize: 8, marginTop: 4 }}>
            {tieneFactura ? 'Precio con IVA incluido' : 'Precio sin IVA — solicita factura en tienda'}
          </Text>
        </View>

        {/* Policies */}
        <View style={s.policy}>
          <Text style={s.policyTitle}>Políticas de la empresa</Text>
          <Text>• Devoluciones: Aceptamos devoluciones dentro de 30 días naturales con empaque original y comprobante de compra.</Text>
          <Text>• Garantía: Todos los productos cuentan con garantía del fabricante. PrintMax actúa como intermediario para trámites de garantía.</Text>
          <Text>• Envíos: El tiempo de entrega es de 2-5 días hábiles. Envío gratuito en pedidos mayores a $800 MXN.</Text>
          <Text>• Facturación: Las facturas se emiten dentro de los 30 días del mes de la compra. Posterior a ese plazo no se expedirán.</Text>
          <Text style={{ marginTop: 8, color: '#bbb' }}>
            PrintMax S.A. de C.V. · Av. Revolución 123, CDMX · RFC: PMX123456ABC · ©2025
          </Text>
        </View>
      </Page>
    </Document>
  )
}
