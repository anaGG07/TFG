# Configuración del Frontend EYRA

Este documento contiene las instrucciones para poner en marcha el frontend de la aplicación EYRA.

## Requisitos previos

- Node.js (v18 o superior)
- npm (v8 o superior)
- Backend en ejecución (ver instrucciones en el directorio `eyra-backend`)

## Dependencias a instalar

Necesitarás instalar las siguientes dependencias para el proyecto:

```bash
npm install react-router-dom @tailwindcss/forms axios postcss autoprefixer
```

## Configuración de Tailwind CSS

1. Instala Tailwind CSS y sus dependencias:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Actualiza el archivo `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
}
```

3. Añade las directivas de Tailwind en tu archivo CSS principal (`src/index.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Configuración del entorno

1. Crea un archivo `.env` en la raíz del proyecto:

```
VITE_API_URL=http://localhost:8000/api
```

## Ejecución del proyecto

1. Inicia el servidor de desarrollo:

```bash
npm run dev
```

2. El frontend estará disponible en `http://localhost:5173`

## Construir para producción

Cuando estés listo para desplegar la aplicación:

```bash
npm run build
```

Esto generará los archivos estáticos en el directorio `dist` que puedes servir con cualquier servidor web.

## Estructura del proyecto

La aplicación está organizada siguiendo una arquitectura modular:

- `src/components`: Componentes reutilizables de UI
- `src/context`: Contextos de React para gestión de estado
- `src/features`: Funcionalidades específicas organizadas por dominio
- `src/hooks`: Hooks personalizados de React
- `src/routes`: Configuración de rutas y páginas
- `src/services`: Servicios para comunicación con API
- `src/types`: Definiciones de tipos TypeScript
- `src/utils`: Utilidades y funciones auxiliares

## Funcionalidades implementadas

- Autenticación (registro, inicio de sesión)
- Seguimiento de ciclo menstrual
- Dashboard con información personalizada
- Recomendaciones basadas en la fase del ciclo
- Calendario para visualización y registro de información
