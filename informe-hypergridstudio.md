# Informe técnico — HyperGridStudio (hypergridstudio.com)

> Estado del repositorio al **2026-08-31**, rama `main`, working tree limpio.
> Documento preparado como input para planificar la migración a **Next.js 15**
> (análoga a la ya realizada en Zycor Construction).

---

## 0. Resumen ejecutivo

| Aspecto | Estado actual |
|---|---|
| Tipo de proyecto | Sitio **estático vanilla** (HTML + CSS + JS), **sin framework de UI** |
| Bundler | Vite 8 (modo MPA, 2 entradas HTML) |
| Componentización | **Ninguna** — todo el markup es HTML inline en 2 archivos |
| Estilos | **CSS puro** con custom properties. **No hay Tailwind** |
| Animaciones | GSAP 3.15 + ScrollTrigger (único plugin). **No hay Lenis** |
| i18n | Sistema propio ES/EN por `data-i18n` + `localStorage`, único archivo `i18n.js` |
| Contenido | Textos centralizados en `i18n.js`; estructura (portfolio, pricing, testimonios) **hardcodeada en el markup** |
| Rutas | 1 landing con anclas (`index.html`) + 1 página standalone (`privacidad.html`) |
| Deploy | Vercel (`vercel.json` mínimo) |
| Archivos totales de código | ~4.785 líneas en 5 archivos |

**Puntos de fricción principales para la migración** (detallados en §13):
duplicación de header/footer/lang-switcher entre los 2 HTML, textos duplicados
(HTML + `i18n.js`), assets referenciados que **no existen** en el repo, código
JS muerto (modal de privacidad, formulario de contacto), y `dist/` desactualizado.

---

## 1. Stack actual

### 1.1 `package.json` (contenido completo)

```json
{
  "name": "landing-page-hyper-grid-studio",
  "version": "1.0.0",
  "description": "",
  "main": "script.js",
  "scripts": {
    "dev": "node node_modules/vite/bin/vite.js",
    "build": "node node_modules/vite/bin/vite.js build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/owengmz/HyperGridStudio.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "bugs": {
    "url": "https://github.com/owengmz/HyperGridStudio/issues"
  },
  "homepage": "https://github.com/owengmz/HyperGridStudio#readme",
  "devDependencies": {
    "terser": "^5.46.1",
    "vite": "^8.0.0",
    "vite-plugin-static-copy": "^3.3.0"
  },
  "dependencies": {
    "@vercel/analytics": "^2.0.1",
    "gsap": "^3.15.0"
  }
}
```

Notas:
- `"type": "module"` → todo el proyecto es ESM.
- Los scripts invocan `node node_modules/vite/bin/vite.js` en lugar de `vite`
  (workaround típico de Windows/PATH). En Next.js esto se reemplaza por
  `next dev` / `next build`.
- **No hay** script `preview`, `lint`, `format` ni `test`.

### 1.2 Versiones exactas resueltas (`package-lock.json`, lockfileVersion 3)

| Paquete | Rango declarado | Versión instalada |
|---|---|---|
| `vite` | `^8.0.0` | **8.0.0** |
| `terser` | `^5.46.1` | **5.46.1** |
| `vite-plugin-static-copy` | `^3.3.0` | **3.3.0** |
| `@vercel/analytics` | `^2.0.1` | **2.0.1** |
| `gsap` | `^3.15.0` | **3.15.0** |

### 1.3 Versión de Node

- **No hay `engines` en `package.json`.**
- **No hay `.nvmrc` ni `.node-version`.**
- Node local en la máquina de desarrollo: **v24.20.0** · npm **11.19.0**.
- Vercel usará su default de proyecto (no está fijado en `vercel.json`).

> Para Next.js 15 conviene fijar Node ≥ 18.18 (recomendado 20.x o 22.x LTS) vía
> `engines` + `.nvmrc`.

### 1.4 `vite.config.js` (contenido completo)

```js
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
```

Observaciones relevantes para la migración:
- Build **MPA** con 2 entradas. En Next.js esto se resuelve con el App Router
  (`app/page.tsx` + `app/privacidad/page.tsx`).
- `viteStaticCopy` existe porque `public/` **no** se está usando como el
  directorio público estándar de Vite (los assets viven en la raíz).
  En Next.js todo esto se resuelve moviendo los archivos a `public/`.
- `sitemap.xml` y `robots.txt` se copian manualmente → en Next.js 15 se
  generan con `app/sitemap.ts` y `app/robots.ts`.

---

## 2. Estructura de carpetas y archivos

**No existe un directorio `src/`.** Todo vive en la raíz.

```
HyperGridStudio/
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── vite.config.js
├── vercel.json
│
├── index.html            (828 líneas · 48 KB)  ← landing completa
├── privacidad.html       (247 líneas · 13.9 KB) ← página legal standalone
├── script.js             (712 líneas · 27 KB)  ← TODA la lógica de UI
├── i18n.js               (402 líneas · 22.8 KB) ← diccionario ES/EN
├── styles.css            (2.596 líneas · 55.5 KB) ← TODOS los estilos
├── styles.css.bak        (2.478 líneas · 52.6 KB) ← ⚠️ backup versionado (basura)
│
├── noise.webp            (8.060 B) ← textura, en la RAÍZ (no en img/)
│
├── fonts/
│   ├── dm-sans-v17-latin-500.woff2        (14.304 B)
│   ├── dm-sans-v17-latin-regular.woff2    (14.200 B)
│   ├── syne-v24-latin-700.woff2           (14.072 B)
│   ├── syne-v24-latin-800.woff2           (13.684 B)
│   └── syne-v24-latin-regular.woff2       (13.264 B) ← ⚠️ no referenciada en CSS
│
├── img/
│   ├── 248shots_so.webp        (94.926 B) ← imagen del hero
│   ├── logo.webp               (8.060 B)
│   ├── portfolio-wood.webp     (19.648 B)
│   └── portfolio-zycor.webp    (39.114 B)
│
├── public/
│   ├── robots.txt
│   └── sitemap.xml
│
└── dist/                 ← ignorado por git, PERO presente en el FS y desactualizado
```

`.gitignore` (completo):

```
# Dependencias
node_modules/
.claude/
design-system

# Build output
dist/

# Sistema operativo
.DS_Store
Thumbs.db
desktop.ini

# Editor / IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Variables de entorno
.env
.env.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Cache de Vercel
.vercel/
```

> ⚠️ El `.gitignore` menciona `design-system`, pero ese directorio **no existe**
> en el working tree.

---

## 3. Organización del contenido: rutas y secciones

### 3.1 Rutas / documentos HTML

Es un **híbrido**: una landing de una sola página con navegación por anclas,
**más** una segunda página HTML independiente.

| Ruta | Archivo | Notas |
|---|---|---|
| `/` | `index.html` | Landing completa, 7 secciones por ancla |
| `/privacidad.html` | `privacidad.html` | Página legal standalone. Migrada desde un modal (commit `9984f31`) porque **Meta/WhatsApp Business exige una URL directa**, no un modal |

`privacidad.html` **replica** header, menú móvil, lang-switcher, footer y botón
flotante de WhatsApp de `index.html` (copia literal del markup), y carga el
**mismo** `script.js` — todos los bloques están protegidos con guards, así que
las partes que dependen de elementos ausentes simplemente no corren.

### 3.2 Secciones de `index.html` (mapa de líneas)

| # | Sección | `id` | Líneas | Clase CSS raíz | En nav |
|---|---|---|---|---|---|
| — | Header fijo | `header` | 100–151 | `.header` | — |
| — | Menú móvil (dialog) | `mobileMenu` | 154–163 | `.mobile-menu` | — |
| — | Overlay móvil | `mobileOverlay` | 166 | `.mobile-overlay` | — |
| 1 | **Hero** | `hero` | 172–279 | `.hero` | — |
| 2 | **Nosotros + Servicios** (fusionada) | `about` | 280–363 | `.about` | ✅ `#about` |
| 3 | **Confianza** (marquee de logos) | *(sin id)* | 364–390 | `.trusted` | — |
| 4 | **Portafolio** | `portfolio` | 391–489 | `.portfolio` | ✅ `#portfolio` |
| 5 | **Testimonios** | `testimonials` | 490–628 | `.testimonials` | — |
| 6 | **Precios** | `pricing` | 629–745 | `.pricing` | ✅ `#pricing` |
| 7 | **Contacto** | `contact` | 746–793 | `.contact` | ✅ `#contact` |
| — | Footer | *(sin id)* | 794–812 | `.footer` | — |
| — | WhatsApp flotante | *(sin id)* | 815–824 | `.whatsapp-float` | — |

**IDs existentes en `index.html`:** `about`, `contact`, `cursor`, `cursorTrail`,
`hamburger`, `header`, `hero`, `mobileMenu`, `mobileOverlay`, `nav`,
`portfolio`, `pricing`, `testimonials`.

> ⚠️ **Ancla rota:** el footer enlaza a `#services`, pero **no existe** ningún
> elemento con `id="services"` (la sección de servicios se fusionó dentro de
> `#about` en el commit `941626d`). Igual pasa con `nav.services` en `i18n.js`,
> que ya no se usa en el nav principal.

### 3.3 Contenido de cada sección

- **Hero** — badges (disponibilidad + 50+ Google Reviews con link a
  `g.co/kgs/hypergridstudio`), H1 en 2 líneas, descripción, 2 CTAs
  (Ver Portafolio + WhatsApp con mensaje pre-cargado), 3 stats con contador
  animado (`48+`, `10 días`, `5★`), imagen `248shots_so.webp` (480×672) con
  chip flotante "5.0 Rating", indicador de scroll, y 2 glows decorativos
  (`.hero-glow-1` / `.hero-glow-2`) con parallax.
- **Nosotros + Servicios** — header de sección, 4 stats estáticos
  (`2+`, `48+`, `100%`, `24/7`) y grid de **4** service-cards
  (`web`, `shopping_bag`, `speed`, `smart_toy`).
  > ⚠️ El diccionario `i18n.js` define `card1`, `card2`, `card4`, `card5`
  > (no hay `card3`) — la numeración quedó con hueco tras eliminar una tarjeta.
  > ⚠️ El icono `smart_toy` **no está** en el subset `&text=` de Material Symbols
  > cargado en el `<head>` → probablemente no renderiza.
- **Confianza** — marquee CSS infinito con 5 items duplicados (TechFlow,
  Wood Designs, SkyNet, Venture X, SecureBase). Todos **placeholders salvo
  Wood Designs**.
- **Portafolio** — 2 `article.portfolio-card`: *Zycor Construction LLC*
  (link live a `zycorconstruction.com`, tags HTML5/Tailwind/JS/Vercel) y
  *Wood Designs* (badge "Próximamente", botón deshabilitado).
- **Testimonios** — 3 `article.testimonial-card` con icono de Google, 5 estrellas,
  cita, foto de autor + fallback de iniciales: Yerin Dominguez (Zycor),
  Facundo Bustos (Wood Designs), Andrés R. (Emprendedor Digital).
- **Precios** — 3 `.pricing-card`: *Tienda Online* $800, *Landing Page* $150
  (`.pricing-featured`, badge "Más Popular"), *Proyecto Personalizado*
  "A consultar". Cada uno con 5 features y CTA a `#contact`.
- **Contacto** — **ya no tiene formulario.** Es un bloque hero con headline,
  subtítulo, CTA a WhatsApp, CTA "Agendar reunión" a
  `https://calendly.com/USUARIO` (⚠️ **URL placeholder sin reemplazar**) y
  botones sociales (Instagram, TikTok).

### 3.4 Estructura de `privacidad.html`

`<main class="legal" id="privacy-content">` con header legal + 8 secciones más
un bloque WhatsApp/Aliz:

`privacy.s1` … `privacy.s4`, luego `privacy.wa_*` (título, intro, qué datos,
para qué, procesamiento, con quién se comparte, retención, eliminación), y
`privacy.s6` … `privacy.s8`. **Todos** los textos vienen de `i18n.js`
(45 `data-i18n` + 3 `data-i18n-html`).

---

## 4. Inventario de componentes

**No hay framework de UI ni sistema de componentes de ningún tipo.**
No hay React/Vue/Svelte, no hay Web Components, no hay templating, no hay
partials ni includes. Es HTML plano.

### 4.1 Módulos JS reales

Solo **2 archivos ESM**:

| Archivo | Exporta | Rol |
|---|---|---|
| `i18n.js` | `export const translations` | Diccionario de datos. Es el **único** módulo con export |
| `script.js` | — (side effects) | Un solo `DOMContentLoaded` con 14 bloques IIFE/inline |

`script.js` importa: `@vercel/analytics` (`inject`), `./i18n.js`, `gsap`,
`gsap/ScrollTrigger`.

### 4.2 Mapa de bloques de `script.js` (712 líneas)

| Bloque | Título (comentario original) | Líneas aprox. | Estado |
|---|---|---|---|
| 1 | Cursor personalizado (punto + trail con lerp) | 22–90 | Activo, solo `pointer: fine` |
| *(2)* | *— numeración saltada, no existe —* | — | — |
| 3 | Menú móvil / hamburguesa | 92–157 | Activo |
| 4 | Revelado al scroll (GSAP ScrollTrigger) | 158–227 | Activo |
| 5 | Contadores animados (GSAP) | 228–260 | Activo |
| 6 | Botones magnéticos (`.magnetic`) | 261–282 | Activo |
| 7 | Enlace de navegación activo (ScrollTrigger) | 283–307 | Activo |
| 8 | Efecto 3D en tarjetas de precios | 308–339 | Activo |
| 9 | Destello de luz en tarjetas de servicio | 340–363 | Activo |
| 10 | **Formulario de contacto** (validación + Formspree) | 364–452 | ☠️ **Código muerto** — no existe `#contactForm` en ningún HTML |
| 11 | Parallax del hero (GSAP scrub) | 453–488 | Activo |
| 12 | Ripple en `.btn-primary` | 489–530 | Activo |
| 13 | **Modal de política de privacidad** | 531–604 | ☠️ **Código muerto** — no existen `#privacyLink` / `#privacyModal` desde la migración a página standalone |
| 14 | **Sistema i18n ES/EN** | 605–673 | Activo |
| 10 *(bis)* | Header scroll + tinte por sección (IntersectionObserver) | 675–712 | Activo — ⚠️ número `10` duplicado |

### 4.3 Componentes visuales candidatos a componentizar en Next.js

Identificados por repetición de markup (hoy 100% inline y duplicado entre los 2 HTML):

| Componente | Ocurrencias | Dónde |
|---|---|---|
| `Header` (logo + nav + lang-switcher + CTA + hamburguesa) | **2 copias literales** | `index.html:100-151`, `privacidad.html:39-84` |
| `MobileMenu` + `MobileOverlay` | **2 copias** | ambos HTML |
| `LangSwitcher` (2 botones con SVG de banderas inline) | **2 copias** | ambos HTML |
| `Footer` | **2 copias** | ambos HTML |
| `WhatsAppFloat` (SVG de ~1 KB inline) | **2 copias** | ambos HTML |
| `CustomCursor` (2 divs) | **2 copias** | ambos HTML |
| `SkipLink` | 2 copias | ambos HTML |
| `SectionHeader` (tag + título + desc) | 5 instancias | `index.html` |
| `ServiceCard` | 4 instancias | `#about` |
| `PortfolioCard` | 2 instancias | `#portfolio` |
| `TestimonialCard` | 3 instancias | `#testimonials` |
| `PricingCard` | 3 instancias | `#pricing` |
| `MarqueeItem` | 10 (5 × 2 sets) | `.trusted` |
| SVG de WhatsApp | **4 copias** distintas inline | hero, contacto, float ×2 |

---

## 5. Estilos

### 5.1 Tailwind

**No se usa Tailwind.** No está en `package.json`, no hay `tailwind.config.*`,
no hay `postcss.config.*`, no hay directivas `@tailwind` en el CSS.

> Nota: `index.html` menciona "Tailwind CSS" como *tag de tecnología* de la
> tarjeta de portfolio de **Zycor** — es contenido, no una dependencia de este
> proyecto.

Hay **una sola** clase de aspecto utilitario, definida a mano: `.w-full`.

### 5.2 CSS custom

Un único archivo global: **`styles.css`, 2.596 líneas / 55.5 KB**, sin
preprocesador, sin CSS Modules, sin capas (`@layer`). Se carga en ambos HTML
con `<link rel="stylesheet" href="styles.css">`.

Existe además **`styles.css.bak` (2.478 líneas) versionado en git**
(último commit que lo tocó: `80f38d7`). Es basura a eliminar antes de migrar.

Organización interna por comentarios de bloque:

| Línea | Bloque |
|---|---|
| 1 | Variables CSS y reset base (`@font-face` + `:root`) |
| 177 | Cursor personalizado |
| 225 | Encabezado fijo |
| 389 | Menú móvil |
| 460 | Sistema de botones |
| 557 | Componentes comunes de sección |
| 601 | Sección Hero |
| 957 | Sección Sobre Nosotros |
| 1005 | Sección de confianza (marquee) |
| 1078 | Sección de servicios |
| 1191 | Sección de portafolio |
| 1291 | Sección de testimonios |
| 1335 | Sección de precios |
| 1491 | Sección de contacto |
| 1547 | Pie de página |
| 1586 | Modal de privacidad ☠️ (estilos muertos) |
| 1696 | Página standalone de política de privacidad |
| 1790 | Animaciones de revelado al scroll |
| 1801 | Animaciones de utilidad |
| 1816 | Accesibilidad: foco visible |
| 1826 | Responsive — tablets |
| 1895 | Responsive — móviles |
| 1990 | Responsive — móviles pequeños |
| 2047 | Responsive — motion reducido |
| 2068 | Hero — badges row *(añadidos posteriores, fuera del orden original)* |
| 2108 | Hero — botón WhatsApp |
| 2142 | Portfolio — chips de país y categoría |
| 2182 | Testimonios — estructura con foto |
| 2287 | Botón flotante de WhatsApp |
| 2398 | Selector de idioma (i18n) |

**Media queries:** 12 en total — breakpoints `1024px`, `768px`, `600px`, `480px`,
más 2 de `prefers-reduced-motion: reduce`. **Mobile-last** (`max-width`), no
mobile-first.

### 5.3 Design tokens

**Sí, hay tokens centralizados** en `:root` (`styles.css:45-89`) — completos:

```css
:root {
  /* Colores principales */
  --primary: #7c3aed;
  --primary-dark: #6d28d9;
  --primary-glow: rgba(124, 58, 237, 0.35);
  --primary-light: #a78bfa;
  /* Canal RGB para uso en rgba() sin hardcodear */
  --primary-rgb: 124, 58, 237;

  /* Fondos y superficies */
  --bg: #0d0b14;
  --bg-card: #131020;
  --bg-surface: #1a1630;

  /* Bordes */
  --border: rgba(255, 255, 255, 0.07);

  /* Textos */
  --text: #f0f4f8;
  --text-muted: #6b8094;
  --text-dim: #9ab0c2;

  /* Tipografia */
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  /* Radios de borde */
  --radius: 12px;
  --radius-lg: 20px;
  --radius-xl: 32px;

  /* Transiciones */
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  --transition-fast: 0.15s ease-out;

  /* Altura del header para calcular offsets */
  --header-h: 80px;
  --header-tint: 13, 11, 20;

  /* Tokens semánticos adicionales (MASTER.md §3) */
  --whatsapp: #25d366;
  --whatsapp-dark: #20ba5a;
  --star: #f59e0b;
  --radius-pill: 100px;
}
```

> El comentario referencia un `MASTER.md` §3 que **no existe** en el repo
> (probablemente vivía en el `design-system/` ignorado).

**Faltantes / hardcodeado:**
- **No hay escala de espaciado** (`--space-*`) → paddings y márgenes en px sueltos.
- **No hay escala tipográfica** (`--text-sm/base/lg`) → `font-size` en `rem`/`clamp()` inline.
- **No hay tokens de sombra** ni de `z-index`.
- La paleta de **tintes de header por sección está hardcodeada en JS**, no en CSS
  (`script.js:686-694`, ver §6.3).
- Los colores de las banderas del lang-switcher (`#c60b1e`, `#ffc400`, `#012169`,
  `#c8102e`) van hardcodeados en los SVG inline.
- `--header-tint` se escribe desde JS como `style.setProperty()`.

### 5.4 Tema

`<html lang="es" class="dark">` en ambos documentos, pero **no hay light mode**:
la clase `dark` es decorativa, no existe ningún selector `.dark` ni
`prefers-color-scheme` en el CSS. El sitio es dark-only.

### 5.5 Tipografía

| Familia | Rol | Pesos declarados | Archivos |
|---|---|---|---|
| **Syne** | `--font-display` | 700, 800, **900 → apunta al 800** | `syne-v24-latin-700.woff2`, `syne-v24-latin-800.woff2` |
| **DM Sans** | `--font-body` | 400, 500 | `dm-sans-v17-latin-regular.woff2`, `dm-sans-v17-latin-500.woff2` |

Todas **self-hosted** con `font-display: swap` y rutas absolutas `/fonts/...`.

> ⚠️ `syne-v24-latin-regular.woff2` (13.264 B) existe en `fonts/` pero **no tiene
> `@font-face`** — es un asset huérfano.

**Iconos:** *Material Symbols Outlined* vía Google Fonts, cargado como
stylesheet no bloqueante (`rel="preload"` + `onload` swap) con subset por
parámetro `&text=`:

```
web,shopping_bag,phone_iphone,speed,check_circle,send,chat,camera,
video_library,star,rocket_launch,storefront,auto_awesome,arrow_forward,
close,data_object,cloud,shield,engineering,code
```

> ⚠️ El icono **`smart_toy`** (usado en la 4ª service-card) **no está en el subset**.
> ⚠️ Varios del subset ya no se usan: `phone_iphone`, `send`, `chat`, `storefront`,
> `engineering`, `code`, `close`.

---

## 6. Animaciones

### 6.1 Librerías

| Librería | Versión | Uso |
|---|---|---|
| **GSAP** | **3.15.0** | Todas las animaciones JS |
| **ScrollTrigger** | (incluido en gsap 3.15.0) | **Único plugin registrado** |

```js
// script.js:9-11
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

- **No hay Lenis**, ni Locomotive Scroll, ni ningún smooth-scroll library.
  El scroll suave es CSS puro: `html { scroll-behavior: smooth; }` +
  `scroll-padding-top: var(--header-h)`.
- **No hay** Framer Motion, AOS, Anime.js, Three.js ni Lottie.
- No se usan otros plugins de GSAP (ni SplitText, ni Flip, ni Draggable).

### 6.2 Uso de GSAP — archivo por archivo

**Todo vive en `script.js`.** `i18n.js` no tiene lógica.

| Bloque | Líneas | Qué hace |
|---|---|---|
| **Revelado al scroll** | 158–227 | `gsap.utils.toArray('.reveal-up:not(#hero .reveal-up)')` → `gsap.from({y:32, opacity:0, duration:0.9, ease:'power2.out'})` con `scrollTrigger:{start:'top 88%', once:true}`. Idem `.reveal-right` con `x:32`. El `delay` se lee del custom property `--delay` inline del elemento (`style="--delay:0.2s"`). |
| **Timeline del hero** | 197–219 | `gsap.timeline({delay:0.4})` → `.hero-content` `fromTo` y:40→0, luego `.hero-visual` x:40→0 con `'-=0.3'` |
| **Contadores** | 228–260 | `gsap.to({val:0}, {val:target, duration:1.6, snap:{val:1}, onUpdate})` sobre `.stat-num[data-target]` |
| **Nav link activo** | 283–307 | `ScrollTrigger.create()` por sección → toggle de clase en el `<a>` correspondiente |
| **Parallax del hero** | 453–488 | `.hero-glow-1` → `y:120` y `.hero-glow-2` → `y:-80`, ambos con `scrub: 1.5`, trigger `#hero` de `top top` a `bottom top` |

### 6.3 Animaciones sin GSAP

| Efecto | Técnica | Líneas |
|---|---|---|
| Cursor personalizado + trail | `requestAnimationFrame` + lerp `0.12`, pausado por `visibilitychange` | `script.js:22-90` |
| Botones magnéticos (`.magnetic`) | `mousemove` → `transform: translate()` directo | `script.js:261-282` |
| Tilt 3D en pricing cards | `mousemove` → `rotateX/rotateY` | `script.js:308-339` |
| Destello en service cards | `mousemove` → custom properties de posición | `script.js:340-363` |
| Ripple en `.btn-primary` | `<span>` inyectado + `@keyframes ripple` inyectado en runtime (`#rippleKF`) | `script.js:489-530` |
| Marquee de logos | CSS `@keyframes` puro | `styles.css:1005+` |
| Header tint por sección | `IntersectionObserver` (threshold 0.25) → `--header-tint` | `script.js:675-712` |

Paleta de tintes hardcodeada en JS (`script.js:686-694`):

```js
const sectionTints = {
  hero:         '20, 10, 36',   /* morado profundo */
  about:        '10, 18, 36',   /* azul oscuro     */
  services:     '16, 10, 32',   /* violeta         */   // ⚠️ id inexistente
  portfolio:    '8,  14, 28',   /* azul marino     */
  testimonials: '20, 8,  32',   /* púrpura         */
  pricing:      '10, 16, 32',   /* azul índigo     */
  contact:      '13, 11, 20',   /* neutro oscuro   */
};
```

### 6.4 Accesibilidad de movimiento

`prefers-reduced-motion` está bien cubierto:
- `script.js:163` → `const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;`
  Se consulta **una sola vez** (no reactivo a cambios) y envuelve los bloques 4, 5, 11 y 12.
  En la rama `else` se fuerza `opacity:1; transform:none` y se escribe el valor
  final de los contadores.
- CSS: 2 bloques `@media (prefers-reduced-motion: reduce)` (`styles.css:2050`, `2375`).

---

## 7. Toggle de idioma ES/EN — implementación exacta

### 7.1 Arquitectura

| Pieza | Ubicación |
|---|---|
| Diccionario | `i18n.js` — `export const translations = { es: {...}, en: {...} }` |
| Estado | Variable local `currentLang` en un IIFE + `localStorage['hgs-lang']` |
| Aplicación | Query del DOM por `data-i18n*` en cada cambio de idioma |
| UI | 2 `<button class="lang-btn" data-lang="es|en">` con SVG de bandera inline |
| Idioma por defecto | `'es'` |
| Detección de idioma del navegador | ❌ **No existe** |
| Rutas por idioma | ❌ **No existe** — la URL no cambia, no hay `/en` ni `?lang=` |

### 7.2 Markup del switcher (`index.html:119-139`)

```html
<!-- Selector de idioma ES / EN -->
<div class="lang-switcher" role="group" aria-label="Selector de idioma">
  <button class="lang-btn active" data-lang="es" aria-label="Cambiar a Español" type="button">
    <svg class="lang-flag" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- Bandera España: rojo-amarillo-rojo -->
      <rect width="24" height="16" fill="#c60b1e" />
      <rect y="4" width="24" height="8" fill="#ffc400" />
    </svg>
    <span>ES</span>
  </button>
  <button class="lang-btn" data-lang="en" aria-label="Switch to English" type="button">
    <svg class="lang-flag" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- Union Jack simplificado -->
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#fff" stroke-width="2.5" />
      <path d="M12 0 V16 M0 8 H24" stroke="#fff" stroke-width="4" />
      <path d="M12 0 V16 M0 8 H24" stroke="#c8102e" stroke-width="2" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#c8102e" stroke-width="1" />
    </svg>
    <span>EN</span>
  </button>
</div>
```

*(el mismo bloque está duplicado literalmente en `privacidad.html:56-76`)*

### 7.3 Lógica completa (`script.js:605-673`)

```js
  /* ─────────────────────────────────────────
     14. SISTEMA DE INTERNACIONALIZACION (i18n)
         ES / EN con selector de banderas en header
  ───────────────────────────────────────── */
  (function initI18n() {
    const STORAGE_KEY = 'hgs-lang';
    const DEFAULT_LANG = 'es';

    /* Determina el idioma inicial: localStorage → default */
    let currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

    /* Aplica todas las traducciones al DOM */
    function applyLang(lang) {
      const t = translations[lang];
      if (!t) return;

      /* Función helper para leer una clave anidada: "hero.title_line1" */
      function resolve(key) {
        return key.split('.').reduce((obj, k) => obj && obj[k], t);
      }

      /* data-i18n → textContent */
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const val = resolve(el.dataset.i18n);
        if (val !== undefined) el.textContent = val;
      });

      /* data-i18n-html → innerHTML (para textos con <br> o <span class="text-accent">) */
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const val = resolve(el.dataset.i18nHtml);
        if (val !== undefined) el.innerHTML = val;
      });

      /* data-i18n-placeholder → placeholder attribute */
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const val = resolve(el.dataset.i18nPlaceholder);
        if (val !== undefined) el.placeholder = val;
      });

      /* data-i18n-aria → aria-label attribute */
      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const val = resolve(el.dataset.i18nAria);
        if (val !== undefined) el.setAttribute('aria-label', val);
      });

      /* Actualiza el atributo lang del <html> */
      document.documentElement.lang = lang;

      /* Actualiza botones del switcher */
      document.querySelectorAll('.lang-btn').forEach(btn => {
        const isActive = btn.dataset.lang === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
      });

      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
    }

    /* Aplica idioma guardado al cargar */
    applyLang(currentLang);

    /* Listeners en los botones del switcher */
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang !== currentLang) applyLang(lang);
      });
    });
  })();
```

### 7.4 Los 4 atributos de traducción y su uso real

| Atributo | Aplica a | `index.html` | `privacidad.html` |
|---|---|---|---|
| `data-i18n` | `textContent` | 88 | 45 |
| `data-i18n-html` | `innerHTML` (para `<br>`, `<span class="text-accent">`, `<a mailto>`) | 5 | 3 |
| `data-i18n-placeholder` | `placeholder` | **0** | **0** |
| `data-i18n-aria` | `aria-label` | 1 | 1 |

> `data-i18n-placeholder` es soporte muerto: existía para el formulario de contacto
> que ya fue eliminado del markup.

### 7.5 Limitaciones actuales relevantes para Next.js

1. **FOUC de idioma**: el HTML se sirve siempre en español y el JS reescribe el
   DOM tras `DOMContentLoaded`. Un usuario con `hgs-lang=en` ve español un instante.
2. **SEO monolingüe**: Google indexa solo la versión ES. No hay `hreflang`,
   no hay URLs por locale, el `sitemap.xml` tiene 1 sola URL.
3. `<title>` y `<meta description>` **no se traducen** en `index.html`
   (sí el `<title>` de `privacidad.html`, vía `data-i18n="privacy.page_title"`).
4. El `og:locale` está fijo en `es_AR`.
5. `innerHTML` con contenido del diccionario — funciona porque el diccionario es
   estático y confiable, pero no es un patrón portable a React sin
   `dangerouslySetInnerHTML`.

> Recomendación: en Next.js 15, `next-intl` o el routing i18n nativo del App
> Router con `app/[locale]/`, generando `/` (es) y `/en`, con `alternates.languages`
> en el metadata y sitemap multi-locale.

---

## 8. Datos de contenido

### 8.1 Estado actual: **separación parcial**

| Tipo de contenido | Dónde vive | Separado |
|---|---|---|
| **Textos traducibles** (títulos, descripciones, labels, citas, features) | `i18n.js` | ✅ Sí |
| **Estructura / cantidad de items** (cuántas cards, en qué orden) | HTML inline | ❌ No |
| **Datos no traducibles** | HTML inline | ❌ No |

### 8.2 `i18n.js` — estructura del diccionario

Un solo objeto `translations` con 2 locales espejo. **~154 claves por idioma**,
en 11 namespaces:

```
misc         (2)   skip_link, whatsapp_float
nav          (6)   about, services, portfolio, pricing, contact, cta
hero         (11)  badge_available, badge_reviews, title_line1, title_accent,
                   desc, cta_primary, cta_whatsapp, stat_projects,
                   stat_delivery_suffix, stat_delivery_label, stat_rating
about        (7)   tag, title, desc, stat1..stat4
trusted      (1)   label
services     (11)  tag, title, desc, card1_*, card2_*, card4_*, card5_*  ⚠️ sin card3
portfolio    (10)  tag, title, desc, zycor_*, wood_*
testimonials (9)   tag, title, desc, t1_quote/t1_role, t2_*, t3_*
pricing      (33)  tag, title, desc, plan1_* (7), plan2_* (8 con badge), plan3_* (8)
contact      (14)  tag, title, desc, whatsapp_btn, form_* (10)  ⚠️ form_* muerto
footer       (5)   about, services, portfolio, privacy, copy
privacy      (~40) page_title, back, title, updated, intro, s1..s4, wa_* (12), s6..s8
```

Rango de líneas: `es` = 10–210, `en` = 211–401.
Las claves que contienen HTML llevan un comentario explícito
(`/* data-i18n-html — contiene <br> */`).

### 8.3 Contenido hardcodeado en el markup (NO en `i18n.js`)

| Dato | Ubicación | Comentario |
|---|---|---|
| Valores de los stats del hero (`data-target="48"`, `"10"`, `"5"`) | `index.html:229-259` | Deliberado: GSAP los anima; solo labels y sufijos se traducen |
| Stats de "Nosotros" (`2+`, `48+`, `100%`, `24/7`) | `index.html:291-307` | Solo el label se traduce |
| Nombres de empresas del marquee (TechFlow, Wood Designs, SkyNet, Venture X, SecureBase) | `index.html:372-386` | Placeholders |
| Iconos Material Symbols de cada card | HTML | `web`, `shopping_bag`, `speed`, `smart_toy`, etc. |
| Títulos de proyectos (Zycor Construction LLC, Wood Designs) | `index.html:426, 476` | Nombres propios |
| Tags de tecnología del portfolio (HTML5, Tailwind CSS, JavaScript, Vercel, CSS3) | `index.html:429-434, 479-483` | |
| Chips de portfolio (`Live ↗`, `EE.UU.`, `Landing Page`, `Argentina`, `Sitio Web`) | `index.html:417-421, 464-468` | ⚠️ **No traducidos** aunque son texto visible |
| Emojis de bandera (🇺🇸, 🇦🇷) | `index.html:410, 458` | |
| URLs de proyectos (`zycorconstruction.com`) | `index.html:435` | |
| Nombres/empresas de testimonios (Yerin Dominguez, Facundo Bustos, Andrés R.) | `index.html` | Solo `role` y `quote` se traducen |
| Iniciales de fallback de avatar (`YD`, `FB`, `AR`) | `index.html` | |
| **Precios** (`$800`, `$150`) | `index.html:652, 685` | Solo `plan3_amount` ("A consultar") está traducido |
| **Toda la sección de Contacto** | `index.html:746-793` | ⚠️ Headline, subtítulo y CTAs escritos directo en HTML — **no usan `data-i18n`** pese a que `contact.*` existe en el diccionario. **La sección no se traduce al inglés.** |
| Número de WhatsApp `5492657501242` + mensaje pre-cargado | 4 lugares distintos | Duplicado |
| URL de Calendly | `index.html:768` | ⚠️ `https://calendly.com/USUARIO` — **placeholder sin reemplazar** |
| Redes sociales (Instagram, TikTok) | `index.html` + JSON-LD | Duplicado |
| Email de contacto `owen.dev94@gmail.com` | `i18n.js` (dentro de `privacy.s7_body` / `s8_body`) | |

> **No existe ningún archivo JSON ni `data/*.js`** de contenido estructurado.
> Para la migración conviene crear `data/portfolio.ts`, `data/pricing.ts`,
> `data/testimonials.ts`, `data/services.ts` y `data/site.ts` (contactos, redes,
> WhatsApp) y dejar `i18n` solo para strings.

---

## 9. Assets

### 9.1 Imágenes presentes

| Archivo | Tamaño | Formato | Uso | Dimensiones declaradas |
|---|---|---|---|---|
| `img/248shots_so.webp` | **94.926 B** (~93 KB) | WebP | Imagen del hero (LCP) | `width="480" height="672"`, `loading="eager"`, `fetchpriority="high"` |
| `img/portfolio-zycor.webp` | 39.114 B (~38 KB) | WebP | Card portfolio Zycor | `600×450`, `loading="lazy"` |
| `img/portfolio-wood.webp` | 19.648 B (~19 KB) | WebP | Card portfolio Wood | `600×450`, `loading="lazy"` |
| `img/logo.webp` | 8.060 B | WebP | Logo en header ×2 y footer | header sin `width/height`; footer `120×48` |
| `noise.webp` | 8.060 B | WebP | Textura de fondo — **en la raíz**, copiada por `viteStaticCopy` | — |

**Total de imágenes: ~170 KB.** Todas en **WebP**. No hay AVIF, no hay `srcset`,
no hay `<picture>`, no hay imágenes responsive.

### 9.2 ⚠️ Assets referenciados que NO existen en el repositorio

Esto es importante para la migración — hay **5 rutas rotas**:

| Ruta referenciada | Dónde | Impacto |
|---|---|---|
| `/img/michael-baccin-XopauR-Nagk-unsplash.webp` | `index.html:57` — `<link rel="preload" as="image" fetchpriority="high">` | Preload de una imagen que no existe → **404 en cada carga**, y el preload NO apunta a la imagen real del hero (`248shots_so.webp`). Desperdicia el hint de LCP |
| `/img/testimonial-yerin.webp` | `index.html` testimonio 1 | 404 → cae al fallback de iniciales `YD` |
| `/img/testimonial-facundo.webp` | `index.html` testimonio 2 | 404 → fallback `FB` |
| `/img/testimonial-andres.webp` | `index.html` testimonio 3 | 404 → fallback `AR` |
| `https://hypergridstudio.com/img/og-preview.png` | `og:image` y `twitter:image` | **La preview social no carga** en ningún sitio (WhatsApp, LinkedIn, X, Facebook) |

> El `README.md` menciona un `img/og-template.html` "plantilla para generar la
> imagen OG" que tampoco existe.
> En Next.js 15 esto se resuelve con `app/opengraph-image.tsx` (generación
> dinámica con `next/og`), lo que elimina el problema de raíz.

### 9.3 Fuentes

5 archivos WOFF2 en `fonts/`, **~69.5 KB total**:

| Archivo | Tamaño | Referenciada |
|---|---|---|
| `dm-sans-v17-latin-500.woff2` | 14.304 B | ✅ |
| `dm-sans-v17-latin-regular.woff2` | 14.200 B | ✅ (+ `preload`) |
| `syne-v24-latin-700.woff2` | 14.072 B | ✅ |
| `syne-v24-latin-800.woff2` | 13.684 B | ✅ (+ `preload`, y reusada para el peso 900) |
| `syne-v24-latin-regular.woff2` | 13.264 B | ❌ **huérfana** — sin `@font-face` |

Subset `latin` únicamente. `font-display: swap` en todas.
Preload de las 2 críticas above-the-fold en ambos HTML.

### 9.4 Proceso de optimización

**No existe ningún pipeline de optimización de imágenes.** Concretamente:

- ❌ No hay `vite-imagetools`, `sharp`, `imagemin`, ni plugin equivalente.
- ❌ No hay generación de `srcset` ni de variantes por breakpoint.
- ❌ No hay conversión automática a AVIF.
- ❌ No hay placeholders LQIP/blur.
- ✅ Las imágenes fueron convertidas a WebP **manualmente**, antes de commitear.
- ✅ Vite sí hashea y copia los assets importados desde el HTML/CSS
  (ver `dist/assets/*-BOfNj03t.webp`).
- ✅ Buenas prácticas manuales presentes: `loading="lazy"` en below-the-fold,
  `fetchpriority="high"` en el hero y el logo, `width`/`height` en casi todos los
  `<img>` (falta en el logo del header → posible CLS), `content-visibility: auto`
  global en `img` (`styles.css`), `contain: layout style` en las secciones.

> `next/image` cubriría automáticamente srcset, AVIF/WebP, lazy loading,
> placeholder blur y dimensionamiento.

---

## 10. SEO

### 10.1 `public/robots.txt` (completo)

```
User-agent: *
Allow: /

Sitemap: https://hypergridstudio.com/sitemap.xml
```

### 10.2 `public/sitemap.xml` (completo)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hypergridstudio.com/</loc>
    <lastmod>2026-05-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

> ⚠️ **Solo 1 URL.** `privacidad.html` (creada el 2026-06/08) **no está en el sitemap**,
> pese a llevar `robots: index, follow` y ser un requisito de Meta/WhatsApp.
> `lastmod` está desactualizado.

### 10.3 `<head>` completo de `index.html` (líneas 1–98)

```html
<!DOCTYPE html>
<html lang="es" class="dark">

<head>
  <meta charset="utf-8" />
  <meta name="google-site-verification" content="ViKe7WvZxAF1C3vmgE9tFX6FcLvGM2etpR8NU408QLI" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description"
    content="Hyper Grid Studio - Soluciones web modernas y de alto rendimiento. Especializado en diseño web, e-commerce y proyectos personalizados." />
  <title>Desarrollo Web Profesional | Hyper Grid Studio</title>

  <!-- SEO -->
  <meta name="description"
    content="Diseño y desarrollo de sitios web profesionales a medida. Landing pages, tiendas online y más. Contactame para hacer crecer tu negocio digital.">
  <meta name="author" content="Hyper Grid Studio" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#080f14" />
  <link rel="icon" type="image/webp" href="/img/logo.webp" />
  <link rel="canonical" href="https://hypergridstudio.com/" />

  <!-- Seguridad: fuerza HTTPS en recursos mixtos -->
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Hyper Grid Studio | Professional Web Solutions" />
  <meta property="og:description"
    content="Soluciones web modernas y de alto rendimiento. Especializado en diseño web, e-commerce y proyectos personalizados." />
  <meta property="og:image" content="https://hypergridstudio.com/img/og-preview.png" />
  <meta property="og:url" content="https://hypergridstudio.com/" />
  <meta property="og:locale" content="es_AR" />
  <meta property="og:site_name" content="Hyper Grid Studio" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Hyper Grid Studio | Professional Web Solutions" />
  <meta name="twitter:description"
    content="Soluciones web modernas y de alto rendimiento. Diseño web, e-commerce y proyectos personalizados." />
  <meta name="twitter:image" content="https://hypergridstudio.com/img/og-preview.png" />

  <!-- Preconexion a Google Fonts solo para los iconos -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Preload de la imagen hero: lo antes posible para mejor LCP -->
  <link rel="preload" as="image" href="/img/michael-baccin-XopauR-Nagk-unsplash.webp" fetchpriority="high" />

  <!-- Iconos: carga no bloqueante -->
  <link rel="preload"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0&text=web,shopping_bag,phone_iphone,speed,check_circle,send,chat,camera,video_library,star,rocket_launch,storefront,auto_awesome,arrow_forward,close,data_object,cloud,shield,engineering,code"
    as="style" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript>
    <link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0&text=web,shopping_bag,phone_iphone,speed,check_circle,send,chat,camera,video_library,star,rocket_launch,storefront,auto_awesome,arrow_forward,close,data_object,cloud,shield,engineering,code" />
  </noscript>

  <!-- Preload de fuentes criticas above-the-fold -->
  <link rel="preload" href="/fonts/syne-v24-latin-800.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/dm-sans-v17-latin-regular.woff2" as="font" type="font/woff2" crossorigin />

  <!-- CSS principal -->
  <link rel="stylesheet" href="styles.css" />

  <!-- Datos estructurados para SEO (Schema.org) -->
  <script type="application/ld+json">
  {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Hyper Grid Studio",
  "description": "Soluciones web modernas y de alto rendimiento. Diseño web, e-commerce y proyectos personalizados.",
  "url": "https://hypergridstudio.com/",
  "logo": "https://hypergridstudio.com/img/logo.webp",
  "sameAs": [
    "https://www.instagram.com/hypergrid.studio",
    "https://www.tiktok.com/@hypergrid.studio"
  ],
  "priceRange": "$150 - $500+",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "AR"
  },
  "areaServed": ["Argentina", "United States", "España"],
  "serviceType": ["Diseño Web", "E-commerce", "Landing Pages", "Desarrollo Web a Medida"]
}
  </script>
</head>
```

### 10.4 JSON-LD

**Existe un único bloque JSON-LD**, tipo `ProfessionalService` (ver arriba,
`index.html:66-96`). `privacidad.html` **no tiene JSON-LD**.

> ⚠️ `priceRange: "$150 - $500+"` no coincide con los precios reales del sitio
> (el plan Tienda Online cuesta $800).
> No hay `Organization`, `WebSite`, `BreadcrumbList`, `Service`, `Review` ni
> `AggregateRating` — pese a que el sitio muestra 3 testimonios con 5 estrellas
> y un badge de "50+ Google Reviews" (candidatos claros a rich snippets).

### 10.5 `<head>` completo de `privacidad.html` (líneas 1–28)

```html
<!DOCTYPE html>
<html lang="es" class="dark">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title data-i18n="privacy.page_title">Política de Privacidad | Hyper Grid Studio</title>

  <!-- SEO: la pagina debe ser indexable y accesible por URL directa (requisito de Meta) -->
  <meta name="description"
    content="Política de Privacidad de Hyper Grid Studio: qué datos recopilamos, cómo los usamos y el tratamiento de datos del servicio de agendamiento por WhatsApp (Aliz)." />
  <meta name="author" content="Hyper Grid Studio" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#080f14" />
  <link rel="icon" type="image/webp" href="/img/logo.webp" />
  <link rel="canonical" href="https://hypergridstudio.com/privacidad.html" />

  <!-- Seguridad: fuerza HTTPS en recursos mixtos -->
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />

  <!-- Preload de fuentes criticas -->
  <link rel="preload" href="/fonts/syne-v24-latin-800.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/dm-sans-v17-latin-regular.woff2" as="font" type="font/woff2" crossorigin />

  <!-- CSS principal (mismo tema oscuro/violeta que el resto del sitio) -->
  <link rel="stylesheet" href="styles.css" />
</head>
```

*(sin Open Graph, sin Twitter Card, sin JSON-LD)*

### 10.6 Problemas de SEO detectados

| # | Problema | Ubicación |
|---|---|---|
| 1 | **`<meta name="description">` duplicada** con contenidos distintos | `index.html:8` y `index.html:12` |
| 2 | **`<meta name="twitter:card">` duplicada** (idéntica) | `index.html:37` y `:38` |
| 3 | `og:image` / `twitter:image` apuntan a **`og-preview.png` inexistente** | `index.html:32, 43` |
| 4 | `sitemap.xml` **no incluye** `/privacidad.html` | `public/sitemap.xml` |
| 5 | `lastmod` del sitemap desactualizado (2026-05-13) | `public/sitemap.xml` |
| 6 | Preload de imagen hero apunta a un archivo **inexistente** | `index.html:57` |
| 7 | **Sin `hreflang`** pese a tener el sitio en 2 idiomas | ambos |
| 8 | `<title>`/`description` de `index.html` **no se traducen** al inglés | ambos |
| 9 | `priceRange` del JSON-LD inconsistente con los precios del sitio | `index.html:82` |
| 10 | `canonical` de la política incluye la extensión `.html` | `privacidad.html:17` |
| 11 | CSP vía `<meta http-equiv>` (solo `upgrade-insecure-requests`) — debería ser header | ambos |

---

## 11. Configuración de deploy

### 11.1 `vercel.json` (completo)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

Es todo. **No hay**: `rewrites`, `redirects`, `headers` (ni de cache ni de
seguridad), `cleanUrls`, `trailingSlash`, `regions`, `framework`, ni
configuración de runtime de Node.

> En Next.js 15 este archivo puede desaparecer casi por completo (Vercel detecta
> el framework), y `headers`/`redirects` se declaran en `next.config.js`.

### 11.2 Scripts de build

```json
"scripts": {
  "dev": "node node_modules/vite/bin/vite.js",
  "build": "node node_modules/vite/bin/vite.js build"
}
```

Pipeline: Vite 8 → Rollup, minificación con **terser**, `cssMinify: true`,
`emptyOutDir: true`, 2 entradas HTML, más la copia estática de
`noise.webp` + `sitemap.xml` + `robots.txt`.

### 11.3 Analytics

`@vercel/analytics` 2.0.1, inicializado en `script.js:14` con `inject()`.
Se ejecuta en **ambas** páginas (comparten `script.js`).
No hay Speed Insights (`@vercel/speed-insights`), ni GA4, ni Meta Pixel.

### 11.4 Estado de `dist/` (⚠️ desactualizado)

```
dist/
├── index.html
├── noise.webp
├── robots.txt
├── sitemap.xml
└── assets/
    ├── dm-sans-v17-latin-500-B9HHJjqV.woff2
    ├── dm-sans-v17-latin-regular-CW0RaeGs.woff2
    ├── logo-BOfNj03t.webp
    ├── portfolio-wood-lhb1zRv3.webp
    ├── portfolio-zycor-nxewqY86.webp
    ├── syne-v24-latin-700-AF3Rs61n.woff2
    └── syne-v24-latin-800-EehdNYzx.woff2
```

Es un build **anterior** a la configuración MPA: **no contiene `privacidad.html`**
ni `248shots_so.webp`. Está gitignoreado, así que no afecta al deploy real
(Vercel construye desde cero), pero confirma que el `dist/` local no refleja el
estado del repo.

---

## 12. Estado de git

| Ítem | Valor |
|---|---|
| Rama actual | `main` (rama principal del repo) |
| Cambios sin commitear | **Ninguno** — working tree limpio (`git status --porcelain` vacío) |
| Remote | `origin` → `git@github.com:owengmz/HyperGridStudio` (SSH) |
| Usuario git | `owengmz` |

Últimos 10 commits:

```
9984f31  feat: migrate privacy policy to standalone page and update translations
941626d  fix: actualizar secciones de "Sobre Nosotros" y "Servicios" para mejorar la claridad y la presentación
9eb57a7  fix: actualizar scripts y estilos para mejorar la carga y el rendimiento
678df4a  Refactor code structure for improved readability and maintainability
22e5d65  fix: ajustar el color de fondo de la cabecera scrolleada a un tono más opaco
13b0acc  fix: ajustar el color de fondo de la cabecera scrolleada a un tono más claro
3a959de  fix: cambiar fondo de la cabecera scrolleada a un color semitransparente
6f7141e  fix: cambiar fondo de la cabecera scrolleada a transparente
dfc61b4  fix: ajustar el scroll y mejorar el padding en la sección hero
2ac6f09  IMAGEN
```

---

## 13. Consideraciones para la migración a Next.js 15

### 13.1 Deuda técnica a resolver *antes o durante* la migración

| # | Ítem | Acción sugerida |
|---|---|---|
| 1 | `styles.css.bak` (2.478 líneas) versionado | Borrar |
| 2 | Bloque 10 de `script.js` — formulario Formspree (89 líneas) sin `<form>` en el DOM | Borrar, o reinstalar el formulario si se lo quiere de vuelta |
| 3 | Bloque 13 de `script.js` — modal de privacidad (74 líneas) sin markup | Borrar (+ los estilos de `styles.css:1586-1695`) |
| 4 | `data-i18n-placeholder` sin usos | Borrar del handler (o mantener si vuelve el form) |
| 5 | 5 assets referenciados inexistentes (§9.2) | Crear las 3 fotos de testimonio, arreglar el preload del hero, generar OG con `app/opengraph-image.tsx` |
| 6 | `syne-v24-latin-regular.woff2` huérfana | Borrar o declarar su `@font-face` |
| 7 | Ancla rota `#services` en el footer | Apuntar a `#about` o crear la sección |
| 8 | `smart_toy` fuera del subset de Material Symbols | Agregarlo al `&text=`, o migrar a `lucide-react` (recomendado en Next) |
| 9 | Sección Contacto sin `data-i18n` — no se traduce | Conectar a las claves `contact.*` ya existentes |
| 10 | `https://calendly.com/USUARIO` — placeholder | Reemplazar por la URL real o quitar el CTA |
| 11 | Meta description y twitter:card duplicadas | Resuelto solo al usar la Metadata API |
| 12 | Numeración de bloques de `script.js` inconsistente (falta el 2, el 10 duplicado) | Irrelevante tras la componentización |
| 13 | Chips de portfolio sin traducir (`EE.UU.`, `Landing Page`, `Sitio Web`) | Mover a `i18n` |
| 14 | Marquee con 4 de 5 empresas placeholder | Decisión de contenido |
| 15 | `priceRange` del JSON-LD desalineado con los precios reales | Corregir |

### 13.2 Mapeo sugerido a la estructura de Next.js 15 (App Router)

```
app/
├── layout.tsx                  ← <html lang>, fonts (next/font/local), Analytics
├── [locale]/                   ← es | en  (next-intl o i18n routing nativo)
│   ├── layout.tsx              ← Header + Footer + WhatsAppFloat + CustomCursor
│   ├── page.tsx                ← landing (compone las 7 secciones)
│   └── privacidad/page.tsx     ← página legal
├── opengraph-image.tsx         ← reemplaza og-preview.png (hoy roto)
├── sitemap.ts                  ← reemplaza public/sitemap.xml, multi-locale
├── robots.ts                   ← reemplaza public/robots.txt
components/
├── layout/   Header, MobileMenu, Footer, LangSwitcher, WhatsAppFloat, CustomCursor, SkipLink
├── sections/ Hero, About, Trusted, Portfolio, Testimonials, Pricing, Contact
├── ui/       Button, SectionHeader, Badge, Chip, ServiceCard, PortfolioCard,
│             TestimonialCard, PricingCard, StatCounter
└── motion/   RevealUp, RevealRight, Parallax, Magnetic, Ripple, Tilt  ← wrappers GSAP
data/        portfolio.ts, pricing.ts, testimonials.ts, services.ts, site.ts
messages/    es.json, en.json   ← desde i18n.js
styles/      globals.css (tokens + base) o migración a Tailwind v4 @theme
public/      img/, fonts/, noise.webp
```

### 13.3 Decisiones abiertas para la sesión de planificación

1. **Estilos**: ¿portar `styles.css` tal cual a `globals.css` (rápido, 2.6k líneas
   de deuda), o reescribir a Tailwind v4 con `@theme` mapeando los tokens de
   `:root` (más trabajo, alineado con Zycor si Zycor usa Tailwind)?
2. **i18n**: ¿`next-intl` con rutas `/` + `/en` (mejor SEO, rompe la UX de
   `localStorage` actual), o mantener un client-side toggle (migración trivial,
   sin ganancia SEO)? La opción de rutas requiere decidir redirects y `hreflang`.
3. **GSAP en React**: `@gsap/react` (`useGSAP`) es el wrapper oficial, y todo lo
   animado necesita `'use client'`. Alternativa: reemplazar reveals y parallax
   por Framer Motion y dejar GSAP solo para lo que no cubre.
4. **Componentes decorativos** (cursor custom, ripple, magnetic, tilt): son
   client-only y pesan poco; decidir si sobreviven a la migración.
5. **Formulario de contacto**: ¿se reinstala como Server Action / Route Handler,
   o queda todo el contacto vía WhatsApp como hoy?
6. **URL de la política**: `/privacidad.html` → `/privacidad`. Requiere un
   **redirect 301** en `next.config.js` porque la URL actual está registrada
   ante Meta/WhatsApp Business.
7. **Fuente de la verdad del contenido**: archivos `data/*.ts` tipados vs. un CMS.

---

*Informe generado el 2026-08-31 a partir del commit `9984f31` en `main`.*
