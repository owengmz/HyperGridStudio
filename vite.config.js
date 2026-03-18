import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssMinify: true,
    minify: 'terser',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'noise.webp', dest: '.' }
      ]
    })
  ]
})