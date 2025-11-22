# Instrucciones para el PDF de Himnos y Lecturas

## 📱 ¿Qué he creado?

He creado un documento HTML especial (`pdf-himnos-lecturas.html`) que:
- Contiene todos los himnos y lecturas de la ceremonia
- Tiene el mismo diseño elegante de tu invitación
- Es totalmente responsive (se ve perfecto en móvil)
- Se puede guardar como PDF desde cualquier navegador

## 🎨 Características del diseño

El PDF respeta completamente tu invitación:
- Mismos colores (dorados, café, verde bosque)
- Mismas tipografías (Great Vibes, Cormorant Garamond, Montserrat)
- Diseño elegante con tarjetas y bordes decorativos
- Optimizado para lectura en móvil y también para impresión

## 📥 ¿Cómo generar el PDF?

### Opción 1: Desde el navegador (Recomendado)
1. Abre el archivo `pdf-himnos-lecturas.html` en cualquier navegador
2. Presiona `Ctrl + P` (Windows) o `Cmd + P` (Mac)
3. Selecciona "Guardar como PDF" como destino
4. Ajusta los márgenes si es necesario
5. Guarda el PDF

### Opción 2: Desde Chrome/Edge (Mejor calidad)
1. Abre `pdf-himnos-lecturas.html` en Chrome o Edge
2. Clic derecho → "Imprimir"
3. Destino: "Guardar como PDF"
4. Layout: Portrait (Vertical)
5. Márgenes: Default
6. Opciones: Activar "Gráficos de fondo"
7. Guardar

## ☁️ ¿Cómo subir a OneDrive y actualizar el enlace?

### Paso 1: Generar y subir el PDF
1. Genera el PDF usando las instrucciones anteriores
2. Nómbralo algo como: `Himnos-y-Lecturas-Boda-Are-Tono.pdf`
3. Súbelo a tu OneDrive
4. Haz clic derecho → "Compartir"
5. Selecciona "Cualquier persona con el vínculo puede ver"
6. Copia el enlace que te da

### Paso 2: Actualizar la invitación
Abre el archivo `index.html` y busca estas dos líneas:

**Línea ~310 (sección de Himnos):**
```html
<a class="btn btn--outline" href="pdf-himnos-lecturas.html" target="_blank">Descargar PDF</a>
```

**Línea ~333 (sección de Lecturas):**
```html
<a class="btn btn--outline" href="pdf-himnos-lecturas.html" id="downloadPdfBtn" target="_blank">Descargar PDF</a>
```

Reemplaza `pdf-himnos-lecturas.html` con la URL de OneDrive en ambos lugares. Por ejemplo:
```html
<a class="btn btn--outline" href="TU_URL_DE_ONEDRIVE_AQUÍ" target="_blank">Descargar PDF</a>
```

### Ejemplo de URL de OneDrive:
```
https://1drv.ms/b/s!AjB...XYZ
```

## 🎯 Funcionalidad actual

Por ahora, el botón "Descargar PDF":
- Abre el archivo HTML en una nueva pestaña
- Los usuarios pueden guardar como PDF desde ahí
- O pueden leer directamente desde el navegador

Cuando actualices con la URL de OneDrive:
- El botón descargará directamente el PDF
- Los usuarios no necesitarán conexión después de descargarlo

## ✨ Extras

El PDF incluye:
- ✅ 5 himnos completos con sus letras
- ✅ 2 lecturas bíblicas completas (Génesis 2:15-25 y Cantar de los Cantares 2)
- ✅ Header decorativo con sus nombres y fecha
- ✅ Footer elegante
- ✅ Diseño optimizado para móvil
- ✅ Colores y tipografías de la invitación

## 📝 Notas

- El archivo HTML (`pdf-himnos-lecturas.html`) no necesita estar en el servidor si usas la URL de OneDrive
- Sin embargo, es bueno tenerlo como respaldo
- Los usuarios pueden imprimir el PDF si lo desean

---

**¿Preguntas?** Si necesitas ajustar algo del diseño o agregar más contenido, solo avísame!
