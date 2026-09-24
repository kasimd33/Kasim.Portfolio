import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const { VITE_SITE_URL = '' } = loadEnv(mode, process.cwd(), 'VITE_');
  const origin = /^https:\/\/[^\s<>"']+$/.test(VITE_SITE_URL) ? VITE_SITE_URL.replace(/\/$/, '') : '';
  return {
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    plugins: [react(), tailwindcss(), {
      name: 'portfolio-metadata',
      transformIndexHtml(html) {
        return html.replace('<!-- production-metadata -->', origin ? `<link rel="canonical" href="${origin}/" /><meta property="og:url" content="${origin}/" /><meta property="og:image" content="${origin}/social-preview.png" /><meta name="twitter:image" content="${origin}/social-preview.png" />` : '');
      },
    }],

  };
});


