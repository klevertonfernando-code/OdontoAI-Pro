import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseadas no modo (ex: .env no local, vars do Netlify em prod)
  // Use '.' instead of process.cwd() to avoid TS error 'Property cwd does not exist on type Process'
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Importante: Isso substitui process.env.API_KEY pelo valor real durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});