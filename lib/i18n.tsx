import type { ReactNode } from 'react'
import { mailtoUrl, site } from '@/data/site'

/**
 * Utilidades de traduccion sobre next-intl.
 *
 * Reemplaza al shim de la Etapa 1c: la resolucion de claves ahora la hace
 * next-intl (`useTranslations` en componentes, `getTranslations` en metadata).
 * Aca queda solo lo que next-intl no aporta: el tipo de claves y los handlers
 * de los tags de rich text.
 */

/* Tipo derivado del diccionario. `typeof import(...)` es solo tipo: no
   agrega el JSON al bundle. */
type Messages = typeof import('@/messages/es.json')

type Join<K extends string, P> = P extends string ? `${K}.${P}` : never

type DeepKeys<T> = T extends readonly unknown[]
  ? never
  : T extends object
    ? { [K in keyof T & string]: K | Join<K, DeepKeys<T[K]>> }[keyof T & string]
    : never

/** Todas las rutas de clave validas de messages/*.json. */
export type MessageKey = DeepKeys<Messages>

/**
 * Handlers de los tags de rich text que usan los mensajes.
 *
 * Los JSON no llevan HTML: traen `<accent>`, `<mail>` y `<br>`, que se
 * resuelven aca. Evita dangerouslySetInnerHTML en todo el sitio.
 *
 * Uso: `t.rich('about.title', richTags)`
 */
export const richTags = {
  accent: (chunks: ReactNode) => <span className="text-accent">{chunks}</span>,
  mail: () => <a href={mailtoUrl()}>{site.email}</a>,
  br: () => <br />,
} as const
