# Hyper Grid Studio — Pagina de Aterrizaje

Pagina de produccion para Hyper Grid Studio, un estudio de desarrollo web especializado en soluciones web modernas y de alto rendimiento.

**Sitio en vivo:** https://hypergrid.studio

---

## Tecnologias Utilizadas

| Capa | Tecnologia |
|---|---|
| Herramienta de construccion | Vite 8 |
| Animaciones | GSAP 3 + ScrollTrigger |
| Analiticas | Vercel Web Analytics |
| Fuentes | Syne (display), DM Sans (body) — autoalojadas |
| Iconos | Material Symbols Outlined (subconjunto via Google Fonts) |
| Despliegue | Vercel |

---

## Como Empezar

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # construccion de produccion a /dist
```

---

## Estructura del Proyecto

```
/
├── index.html          # documento principal
├── script.js           # toda la logica de UI (GSAP, interacciones, formulario)
├── styles.css          # estilos globales y tokens de diseno
├── fonts/              # archivos woff2 de Syne y DM Sans autoalojados
├── img/                # imagenes de hero, portafolio, logo, og-preview
│   └── og-template.html  # plantilla para generar la imagen OG
└── dist/               # salida de construccion de produccion (ignorada por git)
```

---

## Secciones

- **Hero** — titular, botones CTA, contador de estadisticas animado
- **Acerca de** — mision del estudio, flujo de trabajo y vision general de la pila tecnologica
- **Confiado** — marquesina de logos de clientes
- **Servicios** — diseno web, comercio electronico, responsivo, optimizacion
- **Portafolio** — tarjetas de proyecto con enlaces en vivo
- **Testimonios** — reseñas de clientes (marcador de posicion, reemplazar antes del lanzamiento)
- **Precios** — precios de tres niveles con listas de caracteristicas
- **Contacto** — formulario enviado via Formspree, enlaces sociales

---

## Notas de Rendimiento

- Precargas de fuentes locales para cero cambio de diseno en la primera pintura
- Imagen de hero precargada con `fetchpriority="high"`
- Material Symbols cargado como hoja de estilos no bloqueante (subconjunto via parametro `&text=`)
- GSAP ScrollTrigger maneja todas las animaciones de desplazamiento; se respeta `prefers-reduced-motion`
- `contain: layout style` aplicado a todas las secciones principales
- Schema.org `ProfessionalService` JSON-LD para datos estructurados de SEO

---

## Testimonios

Las tres tarjetas de testimonio en `index.html` estan marcadas con comentarios `<!-- PLACEHOLDER -->`. Reemplazar con citas reales de clientes antes de ir en vivo.

---

## Licencia

ISC
