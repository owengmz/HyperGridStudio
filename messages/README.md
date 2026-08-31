# messages/ — strings traducibles

Fuente única de verdad de todo texto visible. Portado desde `legacy/i18n.js`,
conservando los mismos 12 namespaces de primer nivel:

`misc` · `nav` · `hero` · `about` · `trusted` · `services` · `portfolio` ·
`testimonials` · `pricing` · `contact` · `footer` · `privacy`

`es.json` es el locale por defecto. Ambos archivos deben mantener **exactamente
las mismas claves**: la paridad se valida antes de componentizar.

## Convenciones

Los archivos **no contienen HTML**. Donde `legacy/i18n.js` incrustaba markup, se
usan tags de rich text que el componente resuelve con `t.rich()` de next-intl.
Así se evita `dangerouslySetInnerHTML` en todo el sitio.

| Convención | Reemplaza a | Se renderiza como |
|---|---|---|
| `<accent>…</accent>` | `<span class="text-accent">…</span>` | el span de color de acento |
| `<mail></mail>` | `<a href="mailto:owen.dev94@gmail.com">…</a>` | enlace mailto; la dirección sale de `data/site.ts` |
| `\n` | `<br>` | salto de línea |

Ejemplo:

```tsx
t.rich('about.title', { accent: (chunks) => <span className="text-accent">{chunks}</span> })
```

`<mail></mail>` va vacío a propósito: el texto del enlace es el propio email, y
ese dato vive en `site.email`. Así el correo no queda duplicado en 6 strings
como pasaba en legacy.

## Relación con `data/`

Los archivos de `data/` no guardan texto traducible: guardan estructura
(orden, iconos, URLs, precios, nombres propios) y un campo `i18nKey` que apunta
acá. Por ejemplo `services.cards.landing` resuelve a `.title` y `.body`.

Las listas de features de los planes son arrays JSON; se leen con
`t.raw('pricing.plans.store.features')`.

## Diferencias respecto de `legacy/i18n.js`

- **Eliminadas** las 10 claves `contact.form_*`: el formulario ya no existe en el
  markup desde que Contacto pasó a ser solo CTAs.
- **Reescrita** la sección `contact` con la copy que hoy está en producción
  (estaba hardcodeada en el markup). La copy vieja del diccionario se descartó.
  El inglés de esta sección es nuevo.
- **Renumeradas** las claves de `services`: `card1/card2/card4/card5` (con el
  hueco en `card3`) pasaron a ids semánticos `landing/ecommerce/seo/automation`.
- **Agregadas** claves para texto que estaba hardcodeado en español y no se
  traducía: chips de país y tipo del portafolio, `chip_live`, los `alt` de las
  imágenes, varios `aria-label` y `testimonials.items.andres.company`.
