# Mi Control Financiero

Aplicación web progresiva (PWA) para registrar ingresos y gastos manualmente en pesos chilenos.

## Versión 2.0
- Panel mensual con balance, ingresos, gastos y avance del presupuesto.
- Proyección de gastos al cierre del mes y promedio diario.
- Distribución visual de gastos por categoría.
- Historial con filtros por mes, tipo y búsqueda.
- Edición y eliminación de movimientos.
- Comparación con el mes anterior.
- Presupuesto mensual por mes.
- Exportación de historial CSV.
- Copia de seguridad y restauración JSON.
- Diseño adaptable a teléfonos y caché para uso sin conexión.

## Publicar
El repositorio se publica mediante GitHub Pages. En Settings → Pages, selecciona Deploy from a branch y la rama `main` (o la rama que corresponda) con la carpeta `/(root)`.

## Instalar en Android
1. Abre la dirección HTTPS publicada en Chrome.
2. Abre el menú ⋮ y selecciona Instalar aplicación o Añadir a pantalla de inicio.
3. Confirma la instalación.

## Datos y privacidad
Los movimientos se guardan localmente en el navegador mediante localStorage. No se envían a un servidor ni existe todavía sincronización entre teléfonos. Para usar la app en más de un dispositivo, cada uno requiere una solución de sincronización autenticada y una base de datos remota; importar/exportar JSON es el mecanismo manual de traslado disponible por ahora. Exporta una copia antes de borrar datos del navegador o cambiar de teléfono.

## Desarrollo
Los archivos principales son `index.html`, `styles.css`, `app.js`, `manifest.json` y `sw.js`.