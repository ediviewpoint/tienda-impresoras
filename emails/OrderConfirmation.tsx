import {
  Body, Container, Head, Heading, Hr, Html, Preview,
  Row, Column, Section, Text, Button,
} from '@react-email/components'

interface OrderItem {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

interface Props {
  orderNumber: string
  clientName: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  tieneFactura: boolean
  paymentMethod: string
}

const fmt = (n: number) =>
  `Bs. ${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(n)}`

const PAYMENT_LABELS: Record<string, string> = {
  paypal: 'PayPal',
  transferencia: 'Transferencia Bancaria',
  manual: 'WhatsApp / Efectivo',
}

export default function OrderConfirmation({
  orderNumber, clientName, items, subtotal, shipping, total, tieneFactura, paymentMethod,
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Tu pedido {orderNumber} ha sido recibido — PrintMax</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>

          {/* Header */}
          <Section style={{ backgroundColor: '#1852D9', padding: '32px 40px' }}>
            <Heading style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 800 }}>
              Print<span style={{ color: '#93c5fd' }}>Max</span>
            </Heading>
          </Section>

          {/* Body */}
          <Section style={{ padding: '32px 40px' }}>
            <Heading as="h2" style={{ fontSize: 20, color: '#111827', marginTop: 0 }}>
              ¡Pedido recibido, {clientName}!
            </Heading>
            <Text style={{ color: '#6b7280', fontSize: 15, lineHeight: '24px' }}>
              Hemos registrado tu pedido correctamente. Te contactaremos para coordinar la entrega.
            </Text>

            {/* Order number */}
            <Section style={{ backgroundColor: '#eff6ff', borderRadius: 10, padding: '12px 20px', margin: '20px 0' }}>
              <Text style={{ margin: 0, fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>
                Número de pedido
              </Text>
              <Text style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 800, color: '#1852D9', fontFamily: 'monospace' }}>
                {orderNumber}
              </Text>
            </Section>

            {/* Items */}
            <Heading as="h3" style={{ fontSize: 14, color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Productos
            </Heading>
            {items.map((item) => (
              <Row key={item.name} style={{ borderBottom: '1px solid #f3f4f6', padding: '10px 0' }}>
                <Column>
                  <Text style={{ margin: 0, fontSize: 14, color: '#111827', fontWeight: 600 }}>{item.name}</Text>
                  <Text style={{ margin: '2px 0 0', fontSize: 13, color: '#9ca3af' }}>× {item.quantity} — {fmt(item.unitPrice)} c/u</Text>
                </Column>
                <Column align="right">
                  <Text style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{fmt(item.total)}</Text>
                </Column>
              </Row>
            ))}

            {/* Totals */}
            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0 12px' }} />
            <Row>
              <Column><Text style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Subtotal</Text></Column>
              <Column align="right"><Text style={{ margin: 0, fontSize: 13, color: '#374151' }}>{fmt(subtotal)}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Envío</Text></Column>
              <Column align="right">
                <Text style={{ margin: '4px 0 0', fontSize: 13, color: shipping === 0 ? '#10b981' : '#374151' }}>
                  {shipping === 0 ? 'GRATIS' : fmt(shipping)}
                </Text>
              </Column>
            </Row>
            <Row style={{ marginTop: 8 }}>
              <Column><Text style={{ margin: '8px 0 0', fontSize: 16, fontWeight: 800, color: '#111827' }}>Total</Text></Column>
              <Column align="right"><Text style={{ margin: '8px 0 0', fontSize: 16, fontWeight: 800, color: '#1852D9' }}>{fmt(total)}</Text></Column>
            </Row>
            <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
              {tieneFactura ? 'Con factura (IVA incluido)' : 'Sin factura'} · Pago: {PAYMENT_LABELS[paymentMethod] ?? paymentMethod}
            </Text>

            <Button
              href={`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://printmax.bo'}/cuenta`}
              style={{ backgroundColor: '#1852D9', color: '#fff', borderRadius: 999, padding: '12px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: 24 }}
            >
              Ver mis pedidos
            </Button>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: '#f9fafb', padding: '20px 40px', borderTop: '1px solid #e5e7eb' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: 0, textAlign: 'center' }}>
              PrintMax Bolivia · Envío gratis en pedidos +Bs. 500
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
