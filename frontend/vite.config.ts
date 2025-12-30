import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente (se existirem)
  const env = loadEnv(mode, process.cwd(), '')

  // Define o alvo da API: Se estiver no Docker (definido via env), usa 'backend', senão localhost
  const apiTarget = env.VITE_API_TARGET || 'http://127.0.0.1:5000'

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      allowedHosts: true, // Necessário para acesso via túneis (ngrok/cloudflare)
      watch: {
        usePolling: true, // Melhora compatibilidade com Docker no Windows
      },
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
