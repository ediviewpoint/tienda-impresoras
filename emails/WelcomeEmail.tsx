import {
  Body, Container, Head, Heading, Html, Preview,
  Section, Text, Button,
} from '@react-email/components'

interface Props {
  name?: string
  email: string
}

export default function WelcomeEmail({ name, email }: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Bienvenido a PrintMax, {name ?? email}</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
        <Container style={{ maxWidth: 560, margin: '40px auto', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb' }}>

          <Section style={{ backgroundColor: '#1852D9', padding: '32px 40px' }}>
            <Heading style={{ color: '#fff', margin: 0, fontSize: 24, fontWeight: 800 }}>
              Print<span style={{ color: '#93c5fd' }}>Max</span>
            </Heading>
          </Section>

          <Section style={{ padding: '32px 40px' }}>
            <Heading as="h2" style={{ fontSize: 20, color: '#111827', marginTop: 0 }}>
              ¡Bienvenido{name ? `, ${name.split(' ')[0]}` : ''}! 🎉
            </Heading>
            <Text style={{ color: '#6b7280', fontSize: 15, lineHeight: '24px' }}>
              Tu cuenta ha sido creada con el email <strong>{email}</strong>.
              Ya puedes explorar nuestro catálogo, guardar tus pedidos y más.
            </Text>

            <Section style={{ backgroundColor: '#eff6ff', borderRadius: 12, padding: '20px 24px', margin: '24px 0' }}>
              {[
                ['🖨️', 'Catálogo completo', 'Impresoras láser, inkjet, 3D y más'],
                ['📦', 'Historial de pedidos', 'Consulta y rastrea todos tus pedidos'],
                ['🧾', 'Factura electrónica', 'Solicita factura en cada compra'],
              ].map(([icon, title, desc]) => (
                <Section key={title} style={{ marginBottom: 12 }}>
                  <Text style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#1e40af' }}>
                    {icon} {title}
                  </Text>
                  <Text style={{ margin: '2px 0 0', fontSize: 13, color: '#6b7280' }}>{desc}</Text>
                </Section>
              ))}
            </Section>

            <Button
              href="https://printmax.mx/catalogo"
              style={{ backgroundColor: '#1852D9', color: '#fff', borderRadius: 999, padding: '12px 28px', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
            >
              Ver catálogo
            </Button>
          </Section>

          <Section style={{ backgroundColor: '#f9fafb', padding: '20px 40px', borderTop: '1px solid #e5e7eb' }}>
            <Text style={{ fontSize: 12, color: '#9ca3af', margin: 0, textAlign: 'center' }}>
              PrintMax · printmax.mx · Si no creaste esta cuenta, ignora este correo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
