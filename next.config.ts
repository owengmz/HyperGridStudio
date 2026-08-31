import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  // El sitio Vite original vive en legacy/ solo como referencia durante la
  // migracion: no forma parte del build de Next.

  async redirects() {
    return [
      {
        /*
         * La politica de privacidad vivia en /privacidad.html y esa URL esta
         * registrada ante Meta / WhatsApp Business, asi que no puede romperse.
         *
         * Se usa statusCode 301 en vez de `permanent: true` porque este emite
         * 308, y lo pedido es un 301 clasico.
         *
         * Los redirects de next.config corren antes que el middleware, asi que
         * este 301 se aplica aunque el matcher del middleware excluya los
         * paths con extension.
         */
        source: '/privacidad.html',
        destination: '/privacidad',
        statusCode: 301,
      },
      {
        /* Alias en ingles por si alguien llega con el slug viejo prefijado. */
        source: '/en/privacidad.html',
        destination: '/en/privacy',
        statusCode: 301,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
