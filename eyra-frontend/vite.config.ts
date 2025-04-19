import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (desarrollo/producción)
  const env = loadEnv(mode, process.cwd())
  
  // URL de la API (con valor por defecto para producción)
  const apiUrl = env.VITE_API_URL || 'https://eyraclub.es/api'
  console.log(`Building in ${mode} mode with API URL: ${apiUrl}`)
  
  return {
    // Utilizar un plugin personalizado para reemplazar texto directamente
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'replace-localhost',
        transform(code) {
          // Reemplazar todas las cadenas que incluyan localhost:8000
          return code.replace(/http:\/\/localhost:8000\/api/g, apiUrl);
        }
      }
    ],
    // Define solo para las variables de entorno
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'process.env.VITE_API_URL': JSON.stringify(apiUrl)
    },
    // Configuración de build
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})
