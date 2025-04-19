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
    plugins: [react(), tailwindcss()],
    define: {
      // Esto reemplazará todas las referencias en tiempo de compilación
      "import.meta.env.VITE_API_URL": JSON.stringify(apiUrl),
      "process.env.VITE_API_URL": JSON.stringify(apiUrl),
      // Reemplazar directamente las URLs de localhost
      "http://localhost:8000/api": JSON.stringify(apiUrl)
    },
    build: {
      outDir: 'dist',
    }
  }
})
