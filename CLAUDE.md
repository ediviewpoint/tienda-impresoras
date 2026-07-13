# Proyecto: tienda-impresoras-app (ElitePC)

E-commerce de impresoras, laptops y tecnología para Bolivia (Santa Cruz de la Sierra).
Idioma de toda la UI y textos: español. Moneda: bolivianos (Bs.).

## Comandos
- `npm run dev` — servidor de desarrollo
- `npm run build` — verificar que compila antes de dar por terminada una tarea grande
- `npx prisma migrate dev` — migraciones en desarrollo
- `npm run db:seed` — seed de categorías/marcas

## Stack
- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui + Base UI (usar componentes de shadcn SIEMPRE antes de crear uno desde cero)
- Framer Motion para animaciones, Embla Carousel para carruseles
- Zustand (estado global) y nuqs (filtros sincronizados con URL)
- React Hook Form + Zod para TODOS los formularios
- Prisma + Neon (adapter @prisma/adapter-neon). Auth.js v5 (credenciales bcrypt + Google)
- Vercel Blob (imágenes), Resend + react-email (correos), @react-pdf/renderer (recibos), PayPal

## Convenciones de código
- Server Components por defecto; "use client" solo cuando hay interactividad
- Mutaciones con Server Actions; SIEMPRE llamar revalidatePath/revalidateTag al editar productos, stock o pedidos (el caché del App Router es agresivo)
- Validar toda entrada con Zod tanto en cliente como en servidor
- Nunca confiar en precios enviados desde el cliente: recalcular en servidor desde la DB
- Operaciones de stock deben ser atómicas (transacciones Prisma)
- Variables secretas NUNCA con prefijo NEXT_PUBLIC_

## Sistema de diseño (UI)
- Estilo: limpio, moderno, tipo tienda tech. Mobile-first (la mayoría de clientes entran desde WhatsApp en celular)
- Usar bloques de shadcn/ui adaptados; no inventar componentes nuevos si ya existe uno
- Cards de producto: imagen, marca, nombre, specs clave, precio en Bs. destacado, botón de WhatsApp/carrito
- Toda página nueva debe ser responsive y probarse mentalmente en 380px de ancho

## Contexto de negocio (Bolivia)
- Métodos de pago: PayPal, QR Simple, transferencia bancaria
- IVA 13% cuando aplique facturación
- Botones de contacto directo a WhatsApp (NEXT_PUBLIC_WHATSAPP_NUMBER)
- Envíos: entrega en Santa Cruz + envíos a todo el país

## Cómo trabajar en este repo
- Ante tareas grandes: primero proponer un plan corto, luego ejecutar completo sin pedir confirmación por cada archivo
- Después de cambios en varios archivos, correr build/lint y arreglar errores antes de reportar
- No tocar la configuración de Prisma/Neon ni Auth sin avisar primero