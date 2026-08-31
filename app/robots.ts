import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/**
 * Equivalente a legacy/public/robots.txt, apuntando al sitemap generado por
 * app/sitemap.ts en vez de al XML estatico que habia en public/.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', site.url).toString(),
    host: site.url,
  }
}
