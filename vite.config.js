import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

// __dirname no existe en módulos ESM: se reconstruye a partir de import.meta.url
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssMinify: true,
    minify: 'terser',
    // Build multipágina: cada HTML es un punto de entrada independiente.
    // Sin esto, Vite solo incluiría index.html en dist y privacidad.html quedaría fuera.
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacidad: resolve(__dirname, 'privacidad.html'),
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'noise.webp', dest: '.' },
        { src: 'public/sitemap.xml', dest: '.' },
        { src: 'public/robots.txt', dest: '.' }
      ]
    })
  ]
})