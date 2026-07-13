/**
 * Actualiza las descripciones de venta de los productos en la DB.
 *
 * Reglas:
 *   - Solo actualiza productos con descripción MENOR a MIN_DESC_LENGTH caracteres.
 *   - MIN_DESC_LENGTH = 200: las descripciones placeholder del seed miden 68-97 chars;
 *     las descripciones reales del estilo aprobado miden ~700-1200 chars.
 *     Con 200 como umbral se capturan todos los placeholders sin pisar trabajo real.
 *   - Garantía: solo menciona plazo específico si está en las features del producto.
 *
 * Ejecución:
 *   npx tsx scripts/generar-descripciones.ts
 */

import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'
import * as fs from 'fs'

// Cargar .env.local primero (tiene prioridad sobre .env)
function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      for (const line of content.split('\n')) {
        const match = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?$/)
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2]
        }
      }
    } catch { /* archivo no existe */ }
  }
}
loadEnv()

neonConfig.webSocketConstructor = ws

// ── Umbral de protección ────────────────────────────────────────────────────
const MIN_DESC_LENGTH = 200

// ── Descripciones de venta ────────────────────────────────────────────────────
// Estilo aprobado: apertura | rendimiento/calidad | ideal para | cierre confianza
// Formato: párrafos separados por \n\n (el frontend usa whitespace-pre-line)
// Regla garantía: plazo específico solo si figura en las features del producto.

const DESCRIPTIONS: Record<string, string> = {

  'hp-laserjet-pro-4001dn': `La HP LaserJet Pro 4001dn está diseñada para oficinas y negocios que manejan volúmenes altos de impresión y no pueden permitirse interrupciones. Con velocidad y conectividad de nivel profesional, es una de las opciones más sólidas del mercado para documentos de trabajo cotidiano.

Rendimiento: sus 40 páginas por minuto y la doble cara automática reducen a la mitad el tiempo de impresión de informes, contratos y reportes extensos. La conexión Ethernet la integra a la red de la oficina sin depender del WiFi, y la bandeja de 250 hojas disminuye las recargas durante la jornada. La garantía de 3 años cubre cualquier inconveniente sin costos adicionales.

Ideal para: estudio jurídico o contable con impresión diaria intensiva, empresa que necesita compartir la impresora desde varios equipos en red, negocio con alto volumen mensual que busca reducir el costo por página, y cualquier profesional que depende de documentos impresos en su actividad diaria.

Producto nuevo y sellado. Garantía de 3 años incluida, entrega en Santa Cruz y envíos a todo Bolivia.`,

  'bambu-lab-a1-mini-combo': `La Bambu Lab A1 Mini Combo lleva la impresión 3D a un nivel que antes estaba reservado a equipos de mayor precio. Con el sistema AMS Lite incluido desde la caja, permite imprimir con hasta 4 colores en la misma pieza sin intervención manual, algo que abre posibilidades completamente nuevas para diseño y producción personalizada.

Rendimiento: a 500 mm/s imprime prototipos, piezas funcionales y objetos decorativos en una fracción del tiempo de otras impresoras de su rango. La auto-nivelación automática elimina el ajuste manual de la cama antes de cada impresión, y la cámara integrada permite monitorear el trabajo de forma remota por WiFi o LAN sin estar frente al equipo.

Ideal para: diseñadores y makers que quieren explorar la impresión multicolor, emprendedores que fabrican productos personalizados para vender, negocios que necesitan repuestos y piezas funcionales como soportes, adaptadores y engranajes sin recurrir a importaciones, y estudiantes de ingeniería o diseño industrial que necesitan prototipos rápidos.

Producto nuevo y sellado con garantía incluida. Entrega en Santa Cruz y envíos a todo Bolivia.`,

  'epson-ecotank-l3250': `La Epson EcoTank L3250 es la multifuncional indicada para hogares y pequeñas oficinas que quieren imprimir en color sin pagar precios altos por cartuchos. Su sistema de depósitos recargables cambia la lógica del costo: se alimenta con botellas de tinta económicas y alcanza miles de páginas antes de necesitar una recarga.

Calidad de impresión: con resolución de 5760 dpi produce fotos y documentos en color con nitidez notable. Imprime a 33 páginas por minuto en negro, y la función de copia y escaneo integrada evita tener que comprar equipos separados. La conexión WiFi permite imprimir desde cualquier dispositivo de la casa u oficina sin cables.

Ideal para: familia o estudiante que imprime tareas, fotos y documentos desde casa, pequeña empresa con material de marketing frecuente, oficina que necesita copias sin depender de una fotocopiadora aparte, y cualquier usuario que busca reducir el gasto mensual en consumibles.

Producto nuevo y sellado con garantía incluida. Entrega en Santa Cruz y envíos a todo Bolivia.`,

  'creality-ender-3-v3': `La Creality Ender 3 V3 SE es la impresora 3D de entrada que combina facilidad de uso con resultados reales. Con su pantalla táctil, auto-nivelación integrada y marco metálico robusto, está lista para imprimir desde el primer día sin necesitar conocimientos técnicos avanzados.

Rendimiento: imprime a 250 mm/s, una velocidad notable para su rango de precio que reduce significativamente los tiempos en proyectos de varias horas. El proceso de montaje es sencillo y la auto-nivelación elimina el ajuste manual de la cama, uno de los pasos que más frustra a quienes empiezan en la impresión 3D.

Ideal para: estudiante o aficionado que quiere dar sus primeros pasos en fabricación 3D, emprendedor que busca una herramienta accesible para prototipos y piezas personalizadas, docente que desea integrar la impresión 3D en el aula, y usuario con presupuesto ajustado que no quiere sacrificar calidad de construcción.

Producto nuevo y sellado con garantía incluida. Entrega en Santa Cruz y envíos a todo Bolivia.`,

  'hp-deskjet-2775': `La HP DeskJet 2775 es la multifuncional inalámbrica pensada para el hogar que necesita imprimir sin complicaciones. Conectada por WiFi, permite enviar trabajos desde el celular, la tablet o la computadora con la aplicación HP Smart, sin necesidad de cables.

Calidad de impresión: con resolución de 4800 dpi produce documentos y fotos en color con buena definición para uso cotidiano. Además de imprimir, copia y escanea desde la misma unidad, cubriendo las necesidades básicas de una casa sin tener que comprar equipos adicionales.

Ideal para: familia que imprime tareas escolares, formularios y fotos desde casa, estudiante universitario que necesita una impresora práctica para el cuarto, emprendedor en etapa inicial que busca una solución económica para imprimir comprobantes o material sencillo, y usuario que prefiere manejar todo desde el celular con la app HP Smart.

Producto nuevo y sellado con garantía incluida. Entrega en Santa Cruz y envíos a todo Bolivia.`,

  'brother-hl-l2350dw': `La Brother HL-L2350DW es una impresora láser monocromática inalámbrica que encuentra su lugar ideal entre el hogar con uso frecuente y la pequeña oficina. Rápida, silenciosa y con bajo costo por página, es una inversión que se recupera pronto para quienes imprimen documentos a diario.

Rendimiento: con 32 páginas por minuto y doble cara automática, despacha informes, contratos y apuntes en poco tiempo y con bajo consumo de papel. La conexión WiFi permite usarla desde cualquier punto de la casa u oficina, y la función de impresión móvil hace posible enviar trabajos desde el celular sin pasar por la computadora.

Ideal para: hogar con estudiantes que imprimen apuntes y trabajos con regularidad, pequeña empresa que busca una impresora económica y confiable para uso diario, profesional independiente que trabaja desde casa y necesita calidad láser sin ocupar mucho espacio, y oficina con varios usuarios conectados por WiFi.

Producto nuevo y sellado con garantía incluida. Entrega en Santa Cruz y envíos a todo Bolivia.`,

  'xerox-b210': `La Xerox B210 es una impresora láser monocromática compacta que combina conectividad inalámbrica con un rendimiento sólido para su precio. Su diseño permite ubicarla cómodamente en espacios pequeños sin sacrificar velocidad ni capacidad de papel.

Rendimiento: con 31 páginas por minuto y una bandeja de 251 hojas, mantiene el ritmo de una oficina pequeña o home office sin necesidad de recargar constantemente. La función WiFi Direct permite conectar dispositivos directamente a la impresora sin necesidad de un router, y la impresión móvil hace posible enviar trabajos desde el celular en segundos.

Ideal para: pequeña empresa o negocio que necesita una láser confiable sin presupuesto elevado, profesional que trabaja desde casa y busca impresión rápida de documentos, oficina con espacio limitado que necesita una impresora discreta y funcional, y usuario que quiere evitar el costo recurrente de los cartuchos de inyección de tinta.

Producto nuevo y sellado con garantía incluida. Entrega en Santa Cruz y envíos a todo Bolivia.`,

  'canon-pixma-g3160': `La Canon PIXMA G3160 Megatank es la multifuncional de tinta recargable que elimina el gasto frecuente en cartuchos. Con sus depósitos integrados y pantalla LCD, ofrece una experiencia de uso cómoda y uno de los costos por página más bajos del mercado en su categoría.

Calidad de impresión: con resolución de 4800 dpi imprime fotografías y documentos en color con buena nitidez y fidelidad de tonos. Conectada por WiFi, recibe trabajos desde cualquier dispositivo de la red, y la pantalla LCD facilita la operación directa desde el panel sin depender siempre de la computadora.

Ideal para: hogar o pequeña empresa que imprime en color de forma frecuente y quiere reducir el casto mensual en consumibles, emprendedor que imprime flyers, menús o material de promoción, fotógrafo aficionado que quiere copias en casa, y usuario que busca una multifuncional con buena relación precio-rendimiento.

Producto nuevo y sellado con garantía incluida. Entrega en Santa Cruz y envíos a todo Bolivia.`,
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const url = process.env.DATABASE_URL
  if (!url || url.startsWith('file:')) {
    throw new Error('DATABASE_URL debe apuntar a Neon PostgreSQL — asegurate de que .env.local esté presente.')
  }

  console.log(`Conectando a Neon: ${url.slice(0, 45)}...`)

  const pool = new Pool({ connectionString: url })
  const client = await pool.connect()

  let updated = 0
  let skipped = 0
  let notFound = 0

  try {
    for (const [slug, newDesc] of Object.entries(DESCRIPTIONS)) {
      const { rows } = await client.query(
        `SELECT name, description FROM "Product" WHERE slug = $1`,
        [slug]
      )

      if (rows.length === 0) {
        console.log(`  ⚠  No encontrado en DB: ${slug}`)
        notFound++
        continue
      }

      const { name, description } = rows[0] as { name: string; description: string }
      const currentLen = description?.length ?? 0

      if (currentLen >= MIN_DESC_LENGTH) {
        console.log(`  ⏭  Salteado (${currentLen} chars — descripción ya trabajada): ${name}`)
        skipped++
        continue
      }

      await client.query(
        `UPDATE "Product" SET description = $1, "updatedAt" = NOW() WHERE slug = $2`,
        [newDesc, slug]
      )

      console.log(`  ✓  Actualizado (${newDesc.length} chars): ${name}`)
      updated++
    }
  } finally {
    client.release()
    await pool.end()
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Actualizados:    ${updated}
  Salteados:       ${skipped}  (descripción >= ${MIN_DESC_LENGTH} chars)
  No encontrados:  ${notFound}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

main().catch(e => { console.error(e); process.exit(1) })
