# Registro técnico de Mi Finanzas

Revisión: 5 de noviembre de 2026
Repositorio: Victorsjx/mi-control-financiero
Publicación: GitHub Pages
Aplicación: PWA en español y moneda CLP.

## Inventario del código

| Archivo | Función |
|---|---|
| index.html | Estructura de pantallas, navegación, formularios, diálogos y carga de recursos. |
| styles.css | Tema oscuro, diseño adaptable, componentes, animaciones, estados y accesibilidad. |
| app.js | Lógica de negocio, almacenamiento, cálculos, renderizado, historial, análisis, exportaciones y lector OCR. |
| manifest.json | Metadatos de instalación, iconos, ámbito y colores de la PWA. |
| sw.js | Caché offline, actualización de recursos y ciclo de vida del Service Worker. |
| icon-192.png / icon-512.png | Iconos de instalación. |
| cloudflare/worker.js | Proxy OCR: verifica Turnstile y se comunica con Tabscanner sin exponer la API key. |
| README.md | Descripción, publicación, instalación, datos y privacidad. |

## Arquitectura

- Frontend estático: HTML, CSS y JavaScript sin framework.
- Hosting: GitHub Pages.
- Persistencia: localStorage del navegador.
- OCR: navegador → Cloudflare Worker → Tabscanner.
- Anti-bots: Cloudflare Turnstile en navegador y verificación server-side en Worker.
- PWA: manifest y service worker con caché versionada.
- No existe sincronización automática entre dispositivos ni base de datos central.

## Almacenamiento y compatibilidad

Clave de almacenamiento vigente: `mi-control-financiero-v1`. No cambiarla sin migración explícita.

El estado principal conserva:
- transactions: movimientos de ingresos y gastos.
- budgets: presupuesto/sueldo inicial mensual heredado.
- categoryBudgets: límites por categoría.
- goals: metas heredadas y compatibles.

Reglas obligatorias:
1. No borrar ni reinicializar localStorage durante mejoras.
2. No cambiar la clave mi-control-financiero-v1.
3. Mantener compatibilidad con respaldos JSON anteriores.
4. El sueldo inicial no debe duplicarse como movimiento de ingreso.
5. Los gastos de boleta solo se guardan después de la confirmación manual.
6. Las fotografías OCR no se persisten en el estado local.
7. Los datos OCR son sugerencias que el usuario puede corregir.
8. Si no se reconoce una fecha ISO válida, el campo queda vacío; nunca inventar la fecha actual.

## Funcionalidades existentes

- Resumen mensual de saldo, ingresos, gastos y presupuesto.
- Sueldo inicial y límites por categoría.
- Proyección, tasa de ahorro, promedio y disponible diario estimado.
- Indicadores, recomendaciones y gráficos.
- Distribución de gastos por categoría y comparación mensual.
- Historial con filtros por mes, tipo, categoría, fechas y búsqueda.
- Edición y eliminación de movimientos.
- Exportación CSV.
- Respaldo y restauración JSON con confirmación.
- Configuración y eliminación explícita de datos.
- Lector OCR de boletas con Turnstile y revisión manual.
- PWA con caché offline.

## Variables del Worker

En Cloudflare Workers → Settings → Variables and Secrets → Production:
- TABSCANNER_API_KEY
- TURNSTILE_SECRET_KEY

Los valores secretos deben permanecer cifrados en Cloudflare. Nunca incluirlos en GitHub ni en el frontend. La Site Key de Turnstile es pública.

## Servicios externos

| Servicio | Uso | Consideración |
|---|---|---|
| GitHub Pages | Publicar frontend | Depende de la rama configurada. |
| Cloudflare Workers | Backend OCR | Mantener secretos como variables cifradas. |
| Cloudflare Turnstile | Verificación anti-bots | Validar hostname y acción en servidor. |
| Tabscanner | OCR | Servicio externo; informa retención de imágenes/resultados. |

## Protocolo de mantenimiento

1. Leer los archivos actuales antes de editar.
2. Obtener el SHA vigente antes de cada actualización.
3. Preferir cambios localizados sobre reemplazos completos.
4. Validar sintaxis JavaScript y JSON.
5. Alinear referencias CSS/JS del HTML con los recursos del Service Worker.
6. Incrementar el nombre de caché al publicar recursos nuevos.
7. Comprobar que la clave de almacenamiento siga intacta.
8. Si se modifica el modelo, revisar importación/exportación y movimientos heredados.
9. Diferenciar validación de sintaxis de pruebas reales en navegador y teléfono.

## Riesgos y mejoras pendientes

- Los datos viven en el navegador: perder el almacenamiento del sitio puede hacerlos inaccesibles. Mantener copias JSON.
- La importación JSON reemplaza el estado local después de confirmación; validar el esquema y conservar compatibilidad.
- El OCR depende de conexión, Turnstile, Worker y créditos Tabscanner.
- Conviene incorporar pruebas automatizadas de cálculos, importación/exportación y flujos de registro.
- Considerar límites de uso/rate limiting en Worker además de Turnstile.
- La revisión humana de montos y fechas OCR debe seguir siendo obligatoria.

## Estado de revisión

Versión de interfaz y caché: v22. Se aplicó pulido visual de tipografía, espaciado, tarjetas, formularios, controles de foco y adaptación móvil. No se modificó el modelo de datos ni la clave local. La validación final en navegador debe realizarse tras la publicación de GitHub Pages.
