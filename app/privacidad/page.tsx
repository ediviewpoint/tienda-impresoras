import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | PrintMax',
  description: 'Conoce cómo PrintMax recopila, usa y protege tu información personal.',
}

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Política de Privacidad</h1>
      <p className="text-sm text-gray-400 mb-10">Última actualización: julio 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. Responsable del tratamiento</h2>
          <p className="text-gray-600 leading-relaxed">
            PrintMax S.R.L. (en adelante "PrintMax"), con domicilio en La Paz, Bolivia, es responsable del tratamiento de
            los datos personales que nos proporciones. Puedes contactarnos en <strong>privacidad@printmax.bo</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. Datos que recopilamos</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Nombre completo y dirección de correo electrónico</li>
            <li>Número de teléfono (opcional)</li>
            <li>Dirección de envío y facturación</li>
            <li>Historial de pedidos y productos consultados</li>
            <li>Información de pago procesada por terceros (PayPal, transferencia bancaria) — no almacenamos datos bancarios</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. Finalidades del tratamiento</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Procesar y gestionar tus pedidos</li>
            <li>Enviarte confirmaciones de compra y notificaciones de envío</li>
            <li>Ofrecerte soporte al cliente</li>
            <li>Mejorar nuestros productos y servicios</li>
            <li>Con tu consentimiento: enviarte promociones y novedades</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. Compartición de datos</h2>
          <p className="text-gray-600 leading-relaxed">
            No vendemos ni cedemos tus datos personales a terceros. Podemos compartirlos con proveedores de servicios
            que nos ayudan a operar el sitio (procesadores de pago, servicios de correo electrónico) bajo acuerdos de
            confidencialidad estrictos.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. Tus derechos</h2>
          <p className="text-gray-600 leading-relaxed">
            Tienes derecho a acceder, rectificar, cancelar y oponerte al tratamiento de tus datos personales,
            conforme a la Ley N° 164 de Telecomunicaciones y Tecnologías de Información y Comunicación de Bolivia
            y la normativa vigente en protección de datos personales. Envía tu solicitud a <strong>privacidad@printmax.bo</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. Cookies</h2>
          <p className="text-gray-600 leading-relaxed">
            Utilizamos cookies propias para gestionar tu sesión y carrito de compras. Cookies de terceros pueden ser
            utilizadas por proveedores de análisis. Puedes deshabilitarlas en la configuración de tu navegador.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. Cambios a esta política</h2>
          <p className="text-gray-600 leading-relaxed">
            Nos reservamos el derecho de modificar esta política en cualquier momento. Te notificaremos cualquier
            cambio relevante por correo electrónico o mediante un aviso en el sitio.
          </p>
        </section>
      </div>
    </div>
  )
}
