# Mi Control Financiero

Aplicación web progresiva (PWA) para registrar ingresos y gastos manualmente en pesos chilenos.

## Versión 2.4
- Índice mensual en memoria para reducir recorridos repetidos en consultas por mes.
- Historial paginado en bloques de 100 registros para limitar el DOM.
- Validación estricta de copias JSON: tamaño, cantidad, movimientos, montos, metas e identificadores duplicados.
- Controles opcionales de tasa de solicitudes y timeouts en el Worker OCR.
- Pruebas smoke automatizadas en `tests/smoke.test.mjs`.

## Versión 2.3
- Pulido visual de tipografía, espaciado, tarjetas, formularios y navegación adaptable.
- Mejoras de accesibilidad: estados de foco visibles y controles deshabilitados más claros.
- Registro técnico del código, arquitectura, almacenamiento y dependencias en `docs/REGISTRO_TECNICO.md`.

## Versión 2.2
- Lector de boletas con OCR mediante Tabscanner y validación anti-bots Cloudflare Turnstile.
- Revisión manual obligatoria de comercio, monto, fecha y categoría antes de guardar el gasto.
- Las fotografías no se guardan en localStorage; Tabscanner informa una retención de hasta 90 días.

## Versión 2.1
- Panel mensual con balance, ingresos, gastos y avance del presupuesto.
- Proyección del balance al cierre, tasa de ahorro y disponible diario estimado.
- Panel inteligente con alertas y presupuestos por categoría.
- Estadísticas de seis meses, distribución de gastos e ingresos y conclusiones automáticas.
- Distribución visual de gastos por categoría.
- Historial con filtros por mes, tipo, categoría, fechas y búsqueda.
- Edición y eliminación de movimientos.
- Comparación con el mes anterior.
- Presupuesto mensual y límites opcionales por categoría.
- Progreso y aviso visual al superar límites de gasto.
- Exportación de historial CSV.
- Copia de seguridad y restauración JSON.
- Diseño adaptable a teléfonos y caché para uso sin conexión.

## Publicar
El repositorio se publica mediante GitHub Pages. En Settings → Pages, selecciona Deploy from a branch y la rama `main` (o la rama que corresponda) con la carpeta `/(root)`.

## Aplicación Android (APK)

El proyecto incluye una configuración inicial de Capacitor 8 para generar una aplicación Android a partir de los mismos archivos web, sin reemplazar GitHub Pages.

- Configuración: `capacitor.config.json`.
- Dependencias: `package.json`.
- Preparación de recursos: `npm run build:web`.
- Compilación automática: GitHub Actions → “Build Mi Finanzas Android APK”.
- Guía paso a paso, requisitos y migración de datos: `docs/ANDROID_APK.md`.

El primer APK será de depuración y deberá probarse antes de distribuirlo. La importación de una copia JSON será necesaria para trasladar los datos desde el navegador al almacenamiento aislado de la app. El lector OCR requiere adaptar y validar Turnstile/CORS para el origen local de Capacitor.

## Instalar en Android
1. Abre la dirección HTTPS publicada en Chrome.
2. Abre el menú ⋮ y selecciona Instalar aplicación o Añadir a pantalla de inicio.
3. Confirma la instalación.

## Datos y privacidad
Los movimientos se guardan localmente en el navegador mediante localStorage. No se envían a un servidor ni existe todavía sincronización entre teléfonos. Para usar la app en más de un dispositivo, cada uno requiere una solución de sincronización autenticada y una base de datos remota; importar/exportar JSON es el mecanismo manual de traslado disponible por ahora. Exporta una copia antes de borrar datos del navegador o cambiar de teléfono.

## Desarrollo
Los archivos principales son `index.html`, `styles.css`, `app.js`, `manifest.json` y `sw.js`.