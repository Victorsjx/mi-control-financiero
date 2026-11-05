# Mi Finanzas para Android (Capacitor)

## Objetivo
Empaquetar la aplicación web existente como APK Android con Capacitor 8, sin reemplazar la PWA de GitHub Pages.

## Identidad
- Nombre: Mi Finanzas
- Application ID: cl.victorsjx.mifinanzas
- Capacitor: 8.6.0
- Node.js requerido: 22 o superior
- Android Studio requerido para desarrollo local: 2025.2.1 o superior, con Android SDK instalado.

## Archivos
- `package.json`: dependencias y comandos.
- `capacitor.config.json`: identidad y carpeta web.
- `scripts/build-web.mjs`: copia únicamente los recursos web necesarios a `www/`.
- `.github/workflows/android-apk.yml`: genera un APK debug en GitHub Actions.

El directorio `www/` y el proyecto nativo `android/` se generan durante la compilación; no reemplazan los archivos publicados por GitHub Pages.

## Compilar desde GitHub
1. Abre el repositorio y entra en Actions.
2. Selecciona “Build Mi Finanzas Android APK”.
3. Pulsa “Run workflow”.
4. Espera a que el trabajo termine correctamente.
5. Descarga el artefacto `mi-finanzas-android-debug`.
6. Dentro encontrarás `app-debug.apk`, instalable para pruebas en Android.

El APK debug es para pruebas y no es todavía una versión firmada de distribución para Google Play.

## Compilar localmente en Windows
Requisitos: Node.js 22+, Android Studio 2025.2.1+, Android SDK y Java 21 (Android Studio puede gestionar el JDK).

En PowerShell, desde la carpeta del repositorio:
```powershell
npm install
npm run build:web
npx cap add android
npx cap sync android
npx cap open android
```

Para compilar un APK debug desde PowerShell:
```powershell
cd android
.`gradlew.bat assembleDebug
```
El resultado queda en `android\app\build\outputs\apk\debug\app-debug.apk`.

## Datos y migración
La versión web guarda datos en localStorage bajo la clave `mi-control-financiero-v1`. El WebView del APK usa un origen y almacenamiento distintos. Antes de migrar:
1. En la versión web, crea una copia JSON desde Configuración.
2. Conserva el archivo original en un lugar seguro.
3. Instala el APK de prueba.
4. Usa “Restaurar copia de seguridad” en el APK.
5. Comprueba sueldo inicial, movimientos, límites por categoría y metas.

No desinstales ni borres los datos de la versión web hasta comprobar que la copia fue restaurada correctamente en el APK. La preferencia del asistente se almacena por separado y puede requerir volver a configurarse.

## Compatibilidad pendiente de validar
- OCR: el Worker actual solo autoriza el origen `https://victorsjx.github.io` y Turnstile valida ese hostname. La app empaquetada usa el origen local de Capacitor (`https://localhost` por defecto). Por eso el lector OCR requiere adaptar y verificar CORS, hostname permitido y el widget Turnstile antes de afirmar que funciona dentro del APK.
- La cámara/selector de archivos y el flujo de importación/exportación deben probarse en un dispositivo Android real.
- Las funciones web y los datos deben verificarse después de cada sincronización de Capacitor.

## Seguridad
No incluir `TABSCANNER_API_KEY` ni `TURNSTILE_SECRET_KEY` en el APK, el frontend, GitHub ni archivos de configuración. Los secretos permanecen en Cloudflare.
