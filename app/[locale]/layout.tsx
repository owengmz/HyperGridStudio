import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'

import { site } from '@/data/site'
import { routing } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SkipLink } from '@/components/layout/SkipLink'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat'

/**
 * Subset de Material Symbols.
 *
 * Se pide solo el conjunto de glifos que usa el sitio via `&text=`. Respecto de
 * legacy se agrego `smart_toy`, que faltaba y hacia que la cuarta tarjeta de
 * servicios se quedara sin icono.
 */
const MATERIAL_ICONS = [
  'web', 'shopping_bag', 'speed', 'smart_toy', 'check_circle', 'camera',
  'video_library', 'star', 'rocket_launch', 'storefront', 'auto_awesome',
  'arrow_forward', 'data_object', 'cloud', 'shield', 'engineering',
].join(',')

const MATERIAL_SYMBOLS_HREF =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0,0' +
  `&text=${MATERIAL_ICONS}`

/** Prerenderiza ambos idiomas en build. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t('home_title'),
      /* Las paginas interiores solo declaran su nombre; la marca la agrega esto. */
      template: `%s | ${site.name}`,
    },
    description: t('home_description'),
    authors: [{ name: site.name }],
    icons: { icon: '/img/logo.webp' },
    alternates: buildAlternates('/', locale),
  }
}

export const viewport: Viewport = {
  themeColor: '#080f14',
  width: 'device-width',
  initialScale: 1,
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  /* Habilita el renderizado estatico: sin esto todas las paginas pasarian a
     ser dinamicas al leer el locale del request. */
  setRequestLocale(locale)

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Fuentes autoalojadas criticas above-the-fold. */}
        <link
          rel="preload"
          href="/fonts/syne-v24-latin-800.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/dm-sans-v17-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        <link rel="stylesheet" href={MATERIAL_SYMBOLS_HREF} />
      </head>

      <body>
        <NextIntlClientProvider>
          <SkipLink />
          <CustomCursor />

          <Header />

          {children}

          <Footer />
          <WhatsAppFloat />
        </NextIntlClientProvider>

        <Analytics />
      </body>
    </html>
  )
}
