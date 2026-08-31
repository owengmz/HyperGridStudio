import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({ baseDirectory: __dirname })

const eslintConfig = [
  {
    // legacy/ es el sitio Vite original, solo referencia: no se linta.
    // next-env.d.ts lo autogenera Next en cada build.
    ignores: [
      'legacy/**',
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'next-env.d.ts',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // La Etapa 1c usa <img> para comparar 1:1 contra legacy/index.html.
      // La migracion a next/image (srcset, AVIF, blur) es tarea de la Etapa 2;
      // al hacerla, quitar esta regla.
      '@next/next/no-img-element': 'off',
    },
  },
]

export default eslintConfig
