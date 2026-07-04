import {
  Body, Container, Head, Heading, Html, Preview,
  Row, Column, Section, Text,
} from '@react-email/components'

interface Props {
  orderNumber: string
  clientName: string
  clientEmail: string
  total: number
  paymentMethod: string
  itemCount: number
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n)

export default function AdminNewOrder({ orderNumber, clientName, clientEmail, total, paymentMethod, itemCount }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>🛒 Nuevo pedido {orderNumber} — {clientName}</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: 480, margin: '40px auto', backgroundColor: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <Section style={{ backgroundColor: '#111827', padding: '24px 32px' }}>
            <Text style={{ color: '#9ca3af', margin: 0, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              PrintMax Admin
            </Text>
            <Heading style={{ color: '#fff', margin: '4px 0 0', fontSize: 20 }}>
              🛒 Nuevo pedido recibido
            </Heading>
          </Section>

          <Section style={{ padding: '24px 32px' }}>
            <Row>
              <Column>
                <Text style={{ margin: 0, fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>PEDIDO</Text>
                <Text style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: '#1852D9', fontFamily: 'monospace' }}>{orderNumber}</Text>
              </Column>
              <Column align="right">
                <Text style={{ margin: 0, fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>TOTAL</Text>
                <Text style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: '#111827' }}>{fmt(total)}</Text>
              </Column>
            </Row>

            <Section style={{ backgroundColor: '#f9fafb', borderRadius: 10, padding: '16px 20px', margin: '20px 0' }}>
              {[
                ['Cliente', clientName],
                ['Email', clientEmail],
                ['Pago', paymentMethod],
                ['Productos', `${itemCount} artículo${itemCount !== 1 ? 's' : ''}`],
              ].map(([label, value]) => (
                <Row key={label} style={{ marginBottom: 6 }}>
                  <Column style={{ width: 100 }}>
                    <Text style={{ margin: 0, fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{label}</Text>
                  </Column>
                  <Column>
                    <Text style={{ margin: 0, fontSize: 13, color: '#111827', fontWeight: 500 }}>{value}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Text style={{ fontSize: 13, color: '#6b7280' }}>
              Revisa el panel de administración para más detalles y actualizar el estado del pedido.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
