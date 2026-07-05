import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones | PrintMax',
  description: 'Lee los términos y condiciones de uso y compra de PrintMax.',
}

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Términos y Condiciones</h1>
      <p className="text-sm text-gray-400 mb-10">Última actualización: julio 2025</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. Aceptación</h2>
          <p className="text-gray-600 leading-relaxed">
            Al acceder y usar este sitio web, aceptas estar sujeto a estos Términos y Condiciones. Si no
            estás de acuerdo con alguno de ellos, te pedimos que no uses nuestros servicios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. Productos y precios</h2>
          <p className="text-gray-600 leading-relaxed">
            Todos los precios están expresados en bolivianos (Bs.) e incluyen IVA. PrintMax se reserva el derecho
            de modificar precios, descripción o disponibilidad de productos sin previo aviso. Las órdenes confirmadas
            mantienen el precio al momento de la compra.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. Proceso de compra</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>El pedido se considera confirmado una vez recibido el pago</li>
            <li>Recibirás un correo de confirmación con el número de pedido</li>
            <li>Los tiempos de entrega son estimados y pueden variar según disponibilidad</li>
            <li>Para pedidos con factura, deberás proporcionar tu NIT o CI al momento de la compra</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. Envíos</h2>
          <p className="text-gray-600 leading-relaxed">
            Realizamos envíos a todo el territorio boliviano. El envío es gratuito en pedidos mayores a Bs. 500.
            Los tiempos de entrega estimados son de 3 a 7 días hábiles dependiendo de la ubicación.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. Garantía</h2>
          <p className="text-gray-600 leading-relaxed">
            Todos los productos cuentan con garantía oficial del fabricante. PrintMax actúa como intermediario
            autorizado y puede gestionar reclamaciones de garantía con el fabricante correspondiente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. Propiedad intelectual</h2>
          <p className="text-gray-600 leading-relaxed">
            Todo el contenido de este sitio (textos, imágenes, logotipos, diseño) es propiedad de PrintMax o de sus
            proveedores y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción sin
            autorización expresa.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. Limitación de responsabilidad</h2>
          <p className="text-gray-600 leading-relaxed">
            PrintMax no será responsable por daños indirectos, incidentales o consecuentes derivados del uso o
            imposibilidad de uso del sitio. Nuestra responsabilidad máxima se limita al valor del pedido afectado.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">8. Ley aplicable</h2>
          <p className="text-gray-600 leading-relaxed">
            Estos términos se rigen por las leyes del Estado Plurinacional de Bolivia. Cualquier controversia se someterá
            a la jurisdicción de los tribunales competentes de la ciudad de La Paz.
          </p>
        </section>
      </div>
    </div>
  )
}
