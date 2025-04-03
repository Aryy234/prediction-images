# Aplicación de Predicción de Imágenes

## Acerca del proyecto

Esta aplicación permite realizar predicciones basadas en imágenes utilizando modelos de aprendizaje automático.

## Cómo utilizar la aplicación

### Funcionalidades principales

1. **Subir imágenes**: Sube imágenes desde tu dispositivo para analizarlas.
2. **Realizar predicciones**: La aplicación analizará tus imágenes y generará predicciones basadas en el contenido.
3. **Ver resultados**: Visualiza los resultados de las predicciones con porcentajes de confianza.
4. **Guardar histórico**: Mantén un registro de tus predicciones anteriores para referencia futura.

### Guía paso a paso

1. Haz clic en el botón "Subir imagen" en la página principal
2. Selecciona una imagen de tu dispositivo (formatos compatibles: JPG, PNG, WebP)
3. Espera a que se procese la imagen
4. Revisa los resultados de la predicción que aparecerán debajo de la imagen
5. Puedes descargar los resultados o realizar una nueva predicción

## Cómo ejecutar el proyecto localmente

Para ejecutar este proyecto en tu entorno local, sigue estos pasos:

```sh
# Paso 1: Clona el repositorio
git clone <URL_DEL_REPOSITORIO>

# Paso 2: Navega al directorio del proyecto
cd prediction-images

# Paso 3: Instala las dependencias necesarias
npm i

# Paso 4: Inicia el servidor de desarrollo con recarga automática
npm run dev
```

## Tecnologías utilizadas

Este proyecto está construido con:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Requisitos del sistema

- Node.js 16 o superior
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para algunas funcionalidades

## Solución de problemas comunes

- **La imagen no se carga**: Verifica que el formato sea compatible y que el tamaño no exceda los 10MB.
- **Predicción lenta**: Las imágenes de alta resolución pueden tardar más en procesarse.
- **Resultados imprecisos**: Intenta con una imagen de mayor calidad o con mejor iluminación.

## Contribuir al proyecto

Si deseas contribuir a este proyecto, puedes hacerlo mediante pull requests. Asegúrate de seguir las guías de estilo y de documentar adecuadamente tus cambios.
