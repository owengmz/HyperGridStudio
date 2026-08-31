# legacy/ — sitio Vite original (solo referencia)

Snapshot del sitio de producción de hypergridstudio.com tal como estaba en
`main` (commit `9984f31`), movido acá al iniciar la migración a Next.js 15.

**No forma parte del build de Next.** Está excluido de `tsconfig.json`
(`exclude`) y de ESLint (`ignores`). Se conserva para consultar markup,
estilos, animaciones y traducciones mientras se portan las secciones.

| Archivo | Contenido |
|---|---|
| `index.html` | Landing completa (7 secciones por ancla) |
| `privacidad.html` | Página legal standalone |
| `script.js` | Toda la lógica de UI: GSAP, cursor, menú móvil, i18n |
| `i18n.js` | Diccionario ES/EN (~154 claves por idioma) |
| `styles.css` | Estilos globales + design tokens en `:root` |
| `styles.css.bak` | Backup obsoleto (candidato a borrar) |
| `img/`, `fonts/`, `noise.webp` | Assets |
| `public/` | `robots.txt` y `sitemap.xml` del sitio Vite |
| `vite.config.js` | Config de build MPA de Vite 8 |
| `vercel.json` | Config de deploy de Vite (`outputDirectory: dist`) |
| `package.vite.json` | Copia del `package.json` original de Vite |

El análisis detallado está en `../informe-hypergridstudio.md`.

Esta carpeta se elimina cuando la migración esté completa y verificada.
