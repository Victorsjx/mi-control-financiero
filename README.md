# Mi Control Financiero

Aplicación web progresiva (PWA) para registrar manualmente ingresos y gastos en CLP.

## Funciones incluidas
- Registro de ingresos y gastos con fecha, categoría y descripción.
- Resumen mensual de ingresos, gastos y saldo.
- Proyección simple de gasto al cierre de mes.
- Gráfico de distribución por categoría.
- Historial filtrable y eliminación de movimientos.
- Presupuesto mensual.
- Comparación de gastos con el mes anterior.
- Exportación e importación de copia de seguridad JSON.
- Caché offline mediante Service Worker.

## Instalar en iPhone
1. Publica el contenido de esta carpeta en un hosting HTTPS (por ejemplo, GitHub Pages, Netlify o similar).
2. Abre la dirección publicada en Safari.
3. Pulsa Compartir → Añadir a pantalla de inicio.
4. Confirma con Añadir.

Para que la instalación PWA y el modo sin conexión funcionen, debe servirse por HTTPS (localhost también sirve para desarrollo).

## Importante sobre tus datos
Los movimientos se guardan en localStorage del navegador de ese dispositivo. No hay cuenta, sincronización en la nube ni conexión bancaria. Exporta una copia de seguridad desde Configuración. Si borras los datos de Safari o cambias de dispositivo, importa primero tu copia JSON.

## Ejecutar localmente para pruebas
Sirve esta carpeta con un servidor local; no abras index.html directamente como archivo si quieres probar el Service Worker.
