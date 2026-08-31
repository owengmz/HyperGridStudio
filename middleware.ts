import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

/**
 * Resuelve el locale y traduce el slug publico a la ruta interna del arbol
 * de app/ (por ejemplo /en/web-development -> /en/desarrollo-web).
 */
export default createMiddleware(routing)

export const config = {
  /*
   * Excluye API, internos de Next, la imagen Open Graph y cualquier path con
   * extension.
   *
   * `opengraph-image` va listado aparte porque su ruta no lleva extension: sin
   * excluirla, el middleware intentaria prefijarla con el locale y la imagen
   * dejaria de resolver.
   *
   * El punto va como clase de caracteres `[.]` y no como `\.` a proposito:
   * escrito con barra invertida es un escape desconocido en un literal de
   * string, se colapsa a `.` y el patron pasa a excluir cualquier ruta no
   * vacia, con lo que el middleware deja de correr en todo el sitio.
   *
   * Que queden afuera los archivos con punto es lo correcto: el 301 de
   * /privacidad.html lo resuelve next.config.ts, que corre antes.
   */
  matcher: '/((?!api|_next|_vercel|opengraph-image|.*[.].*).*)',
}
