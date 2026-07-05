@AGENTS.md
## FILOSOFÍA DE TRABAJO — LEE ESTO ANTES DE ESCRIBIR CUALQUIER LÍNEA DE CÓDIGO

### PROHIBIDO EL MODO "TEMPLATE"
- NO uses diseños genéricos de IA: nada de gradientes morados/azules por defecto, cards idénticas con sombras suaves, hero sections clichés, ni emojis como iconos.
- NO escribas código "de ejemplo" o "de demostración". Esto es un producto REAL para un negocio REAL de venta de impresoras y laptops en Bolivia.
- NO asumas: si algo no está claro, PREGÚNTAME antes de inventar.

### PIENSA ANTES DE ACTUAR (obligatorio en cada tarea)
Antes de escribir código, SIEMPRE responde primero estas preguntas por escrito:
1. ¿Qué problema real estoy resolviendo y para quién? (cliente comprando una laptop vs admin gestionando stock son mundos distintos)
2. ¿Qué archivos existentes se ven afectados? (revísalos ANTES de tocar nada)
3. ¿Cómo se conecta esto con el resto del sistema? (¿rompe algo? ¿duplica lógica que ya existe?)
4. ¿Cuáles son los casos borde? (stock en 0, imagen que no carga, precio con decimales, usuario sin sesión, conexión lenta)
5. ¿Hay una forma más simple de hacerlo?

Solo DESPUÉS de responder eso, escribe el código.

### CRITERIOS DE CALIDAD REAL
- **Contexto de negocio primero**: una tienda de hardware necesita mostrar SPECS TÉCNICAS bien (procesador, RAM, tipo de tinta/tóner, ppm de impresión). Un cliente compara productos por specs, no por fotos bonitas. Diseña para eso.
- **Datos reales, no placeholder**: usa productos reales de ejemplo (HP LaserJet, Epson EcoTank, Lenovo IdeaPad, Ryzen 5, Core i5) con precios y specs coherentes en bolivianos (Bs), no "Producto 1 - $99.99".
- **Diseño con intención**: cada decisión visual debe tener una razón. Jerarquía clara: ¿qué es lo primero que debe ver el usuario en esta pantalla? ¿Cuál es la acción principal?
- **Código que un senior aprobaría**: nombres descriptivos, funciones pequeñas con una sola responsabilidad, manejo de errores en TODOS los puntos de falla, sin lógica de negocio en los componentes de UI.

### DESPUÉS DE CADA CAMBIO
1. Explícame QUÉ hiciste y POR QUÉ tomaste cada decisión (no solo "listo, ya está").
2. Dime qué probaste y qué casos borde consideraste.
3. Dime qué NO hiciste y por qué (deuda técnica pendiente).
4. Si tomaste un atajo, decláralo explícitamente.

### CUANDO TE PIDA ALGO
- Si mi pedido es vago, hazme 2-3 preguntas clave antes de empezar.
- Si mi pedido tiene un problema (mala idea técnica, riesgo de seguridad), DIME que está mal y por qué, propón una alternativa. No me des la razón por darme gusto.
- Si detectas que algo relacionado ya está roto en el código, avísame aunque no te lo haya pedido.