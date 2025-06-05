import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (desarrollo/producción)
  const env = loadEnv(mode, process.cwd())
  
  // URL de la API (con valor por defecto para producción)
  const apiUrl = env.VITE_API_URL || 'https://old.eyraclub.es/api'
  // Utilizar console.log de manera compatible
  console.log(`Building in ${mode} mode with API URL: ${apiUrl}`)
  
  // Determinar si se debe permitir acceso por IP
  const host = env.VITE_ALLOW_IP_ACCESS === 'true' ? '0.0.0.0' : 'localhost'
  
  return {
    // Permitir acceso desde otras máquinas en la red (útil para testing)
    server: {
      host,
      port: 3000,
      strictPort: true,
      // Configurar CORS para el servidor de desarrollo
      cors: {
        origin: [
          'https://old.eyraclub.es',
          'http://54.227.159.169',
          'http://localhost:3000',
          'http://127.0.0.1:3000'
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
      }
    },
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
    // Define variables de entorno sin depender directamente de process
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      '__APP_ENV__': JSON.stringify(mode)
    },
    // Configuración de build
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false,
      minify: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      }
    }
  }
})
