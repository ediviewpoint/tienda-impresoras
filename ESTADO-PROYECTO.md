# ESTADO DEL PROYECTO: tienda-impresoras-app (ElitePC)

## 1. Mapa de rutas y páginas
*Nota: Se identificaron páginas principalmente mediante exportaciones y estructura de carpetas.*

- `/` (Home) -> `app/page.tsx` [COMPLETA]
- `/catalogo` -> `app/catalogo/page.tsx` [A MEDIAS/FALTA COMPROBAR UI COMPLETA]
- `/producto/[slug]` -> `app/producto/[slug]/page.tsx` [COMPLETA]
- `/carrito` -> `app/carrito/page.tsx` [COMPLETA]
- `/checkout` -> `app/checkout/page.tsx` [COMPLETA]
- `/auth/login` -> `app/auth/login/page.tsx` [COMPLETA]
- `/auth/register` -> `app/auth/register/page.tsx` [COMPLETA]
- `/terminos`, `/privacidad`, `/devoluciones` -> Páginas legales [COMPLETA]
- `/admin` -> `app/admin/page.tsx` [A MEDIAS] (Faltan subrutas completas de gestión, se detectó la ruta principal pero no sub-páginas robustas de edición).
- **Rutas de API (`app/api/`)**: `productos`, `ordenes`, `reviews`, `upload`, `auth/register`, `categories`, `brands`. Todas con métodos CRUD básicos [A MEDIAS] (Ver sección de caché).

## 2. Modelos de datos
Resumen del schema de Prisma (`prisma/schema.prisma`):
- **Brand / Category**: `id`, `name`, `slug`, relación 1:N con `Product`.
- **Product**: `id`, `slug`, `name`, `price`, `stock`, `sku`, `inStock`, relaciones con `Brand`, `Category`, `ProductImage`, y `Review`.
- **Review**: `rating`, `body`, relación con `User` y `Product`.
- **User / Account / Session**: Modelos requeridos por Auth.js.
- **Order**: `orderNumber`, `status`, `subtotal`, `total`, datos del cliente (nombre, email, teléfono, dirección).
- **OrderItem**: Detalle de productos comprados (`quantity`, `unitPrice`).

## 3. Componentes existentes
Ubicados en `components/`:
- **UI Base (`components/ui/`)**: Componentes de shadcn (botones, inputs, dialogs, etc.).
- **Layout (`components/layout/`)**: Navbar, Footer, AnnouncementBar.
- **Catálogo (`components/catalogo/`)**: SidebarFilter, listas.
- **Producto (`components/product/`)**: AddToCartButton, carruseles de imágenes, descripciones.
- **Carrito (`components/carrito/`)**: Drawer o vista de ítems.
- **Checkout (`components/checkout/`)**: PaymentMethodsBolivia, PayPalButton, formularios.
- **PDF (`components/pdf/`)**: Receipt (generador de recibo con `@react-pdf/renderer`).
- **Shared / Providers**: Providers de estado y utilidades generales.
*(No se detectaron carpetas de componentes específicos para `admin/`)*.

## 4. Server Actions y lógica de negocio
Actualmente el proyecto **no utiliza Server Actions** (`"use server"`) para las mutaciones principales; en su lugar, delega la lógica a **API Routes** (Handlers en `app/api/...`).
- **Validación con Zod**: Se infiere su uso en cliente (formularios de React Hook Form) y en las rutas de API.
- **Falta Crítica**: No se encontró uso de `revalidatePath` o `revalidateTag` en el proyecto. Esto significa que si se crea un producto o se actualiza el stock a través de la API o admin, **los cambios no se verán reflejados en el catálogo inmediatamente** debido al caché agresivo del App Router.

## 5. Flujos de usuario y su estado
- **Navegar catálogo y filtrar productos**: [COMPLETO] Utiliza `nuqs` para sincronizar filtros con URL.
- **Ver detalle de producto**: [COMPLETO]
- **Agregar al carrito y modificar cantidades**: [COMPLETO] Gestionado por Zustand (`lib/store/useStore.ts`).
- **Checkout completo**: [A MEDIAS] El formulario existe y guarda la orden en BD, pero depende de PayPal (en modo sandbox) o transferencias.
- **Registro / login**: [COMPLETO] Auth.js implementado con Google y Credenciales.
- **Emails de confirmación**: [A MEDIAS] Implementado en código (`lib/email.ts`, `emails/`), pero requiere configuración de Resend en producción para funcionar.
- **Generación de PDF**: [COMPLETO] Existe `Receipt.tsx` pero hay riesgo de fallos en despliegues serverless por el peso del paquete.
- **Panel admin**: [A MEDIAS/VACÍO] Faltan interfaces completas para crear/editar productos, gestionar stock y cambiar el estado de los pedidos.

## 6. Pendientes encontrados en el código
- `TODO` en `components/checkout/PaymentMethodsBolivia.tsx` (Líneas 13 y 48).
- Valores hardcodeados como fallbacks en envs: `PayPal: 'sb'`, `Teléfono: '+591 2 000-0000'`, `NIT: '—'`, `Banco: 'Banco Bisa'`.

## 7. Estado del build
El comando `npm run build` **FALLÓ** (Exit code: 1).
- **Error:** `Failed to collect page data for /_not-found`
- **Diagnóstico:** Generalmente esto ocurre en Next.js App Router cuando una página pre-renderizada o el `not-found.tsx` intenta hacer una consulta a la base de datos (Prisma) y no hay conexión disponible en tiempo de compilación, o por un error interno en el renderizado estático del Layout/Error boundary.

## 8. Variables de entorno
Comparativa entre `.env.example` y el uso real en código (`process.env`):
- **Definidas y con fallbacks en código:** `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`, `DATABASE_URL`, `ADMIN_EMAIL`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Faltan definir en Producción:** Todo lo relacionado al negocio (`NEXT_PUBLIC_STORE_NIT`, datos bancarios), las claves secretas de Auth (`AUTH_SECRET`), y la DB real (Neon).

## 9. Diseño
- **Visual:** Utiliza **Tailwind CSS v4** nativo, con directivas modernas. Adopta Shadcn UI para consistencia. El diseño está enfocado a ser *mobile-first* (botones grandes de WhatsApp, modales en lugar de ventanas nuevas).
- **Estado:** Las páginas de usuario final (Home, Catálogo, Checkout) parecen tener un estilo coherente. El Panel Admin carece de diseño o componentes dedicados.

## 10. Top 10 para terminar
1. **[Bloqueante] Arreglar el Build Error (`app/not-found.tsx` o Layouts):** La app no compilará en Vercel hasta que esto se resuelva.
2. **[Bloqueante] Invalidación de Caché (`app/api/productos` y `ordenes`):** Añadir `revalidatePath('/')` o tags en las rutas POST/PATCH/DELETE para que el catálogo refleje los cambios de stock o edición.
3. **[Bloqueante] UI del Panel de Administración (`app/admin/`):** Crear vistas de CRUD para `Product`, y un dashboard para gestionar `Order`s (cambiar estados a "pagado" o "enviado").
4. **[Importante] Base de Datos de Producción:** Configurar Neon y hacer un seed inicial real (correr `npx prisma migrate deploy`).
5. **[Importante] Verificar Dominio en Resend:** Para evitar que los emails de confirmación reboten o caigan a spam.
6. **[Importante] Variables de Negocio Oficiales:** Llenar el `.env.production` con el NIT real, WhatsApp oficial y cuenta del Banco Bisa.
7. **[Importante] Pasar PayPal a Live:** Cambiar `NEXT_PUBLIC_PAYPAL_CLIENT_ID` del valor `'sb'` al client ID de producción.
8. **[Mejora] Testear Generación de PDF en Edge:** Verificar si `@react-pdf/renderer` en `app/api/ordenes` no excede el límite de memoria en Vercel.
9. **[Mejora] Revisar TODOs:** Limpiar los `TODO` en `components/checkout/PaymentMethodsBolivia.tsx`.
10. **[Estético] Auditoría Mobile:** Probar exhaustivamente el menú y filtros del catálogo en anchos de 380px para confirmar usabilidad.
