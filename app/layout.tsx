import type { ReactNode } from 'react'

/**
 * Layout raiz.
 *
 * Solo pasa los hijos: el <html> y el <body> los pone app/[locale]/layout.tsx,
 * que es el que conoce el idioma. Este archivo existe porque Next necesita un
 * layout en la raiz de app/ para las rutas que quedan fuera del segmento de
 * locale, como la 404 global.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
