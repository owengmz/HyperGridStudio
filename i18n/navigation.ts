import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

/**
 * Wrappers de navegacion conscientes del locale.
 *
 * Reciben rutas internas ('/desarrollo-web') y emiten la URL publica del
 * idioma activo ('/desarrollo-web' en es, '/en/web-development' en en).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
