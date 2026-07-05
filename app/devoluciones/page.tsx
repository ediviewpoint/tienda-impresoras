import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Devoluciones | PrintMax',
  description: 'Conoce nuestra política de devoluciones, cambios y garantías en PrintMax.',
}

export default function DevolucionesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Política de Devoluciones</h1>
      <p className="text-sm text-gray-400 mb-10">Última actualización: julio 2025</p>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10">
        <p className="text-sm font-semibold text-blue-800">
          30 días para cambios o devoluciones en productos sin uso y en su empaque original.
        </p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">¿Cuándo puedo devolver un producto?</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Dentro de los 30 días naturales siguientes a la entrega</li>
            <li>El producto debe estar sin uso y en su empaque original sellado</li>
            <li>Debes conservar el ticket o comprobante de compra</li>
            <li>Productos de consumo (tóner, tinta, papel) no son elegibles para devolución si fueron abiertos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Productos defectuosos</h2>
          <p className="text-gray-600 leading-relaxed">
            Si tu producto llega dañado o presenta falla de fábrica, contáctanos en las primeras 72 horas tras recibirlo.
            Cubrimos el costo de recolección y te enviamos un reemplazo sin cargo adicional.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Proceso de devolución</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Escríbenos a <strong>devoluciones@printmax.bo</strong> con tu número de pedido</li>
            <li>Nuestro equipo valida la solicitud en 24 horas hábiles</li>
            <li>Te enviamos una guía de recolección sin costo</li>
            <li>Una vez recibido el producto, procesamos el reembolso en 5-7 días hábiles</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Reembolsos</h2>
          <p className="text-gray-600 leading-relaxed">
            El reembolso se realiza mediante el mismo método de pago original. Para pagos con PayPal, el reembolso
            aparece en 3-5 días hábiles. Para transferencias bancarias, en 5-7 días hábiles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Productos excluidos</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>Consumibles abiertos (cartuchos de tinta, tóner, papel)</li>
            <li>Productos con daño físico causado por el cliente</li>
            <li>Equipos con software instalado o modificaciones</li>
            <li>Productos en liquidación marcados como "venta final"</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">¿Tienes dudas?</h2>
          <p className="text-gray-600 leading-relaxed">
            Comunícate con nosotros por WhatsApp, correo electrónico o desde el panel de "Mis pedidos" en tu cuenta.
            Nuestro equipo de soporte atiende de lunes a viernes de 9:00 a 18:00 hrs.
          </p>
        </section>
      </div>
    </div>
  )
}
