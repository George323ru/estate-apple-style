import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY),
      'process.env.VITE_AI_CHAT_PROVIDER': JSON.stringify(env.VITE_AI_CHAT_PROVIDER),
      'process.env.VITE_AI_CHAT_MODEL': JSON.stringify(env.VITE_AI_CHAT_MODEL),
      'process.env.VITE_AI_TEXT_PROVIDER': JSON.stringify(env.VITE_AI_TEXT_PROVIDER),
      'process.env.VITE_AI_TEXT_MODEL': JSON.stringify(env.VITE_AI_TEXT_MODEL)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
