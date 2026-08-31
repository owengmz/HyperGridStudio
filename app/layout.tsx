import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { site } from '@/data/site'

/**
 * Layout raiz.
 *
 * Solo pasa los hijos: el <html> y el <body> los pone app/[locale]/layout.tsx,
 * que es el que conoce el idioma. Este archivo existe porque Next necesita un
 * layout en la raiz de app/ para las rutas que quedan fuera del segmento de
 * locale, como la 404 global.
 *
 * `metadataBase` se declara aca ademas de en el layout de locale: sin esto,
 * esas rutas de fuera del segmento no saben resolver a absoluta la URL de
 * app/opengraph-image.tsx y Next cae a http://localhost:3000.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
