import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (desarrollo/producción)
  const env = loadEnv(mode, process.cwd());
  console.log(`Building in ${mode} mode with API URL:`, env.VITE_API_URL);
  
  return {
  plugins: [react(), tailwindcss()],
  }
})
