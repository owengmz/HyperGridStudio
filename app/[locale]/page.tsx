import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { buildAlternates } from '@/lib/metadata'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Trusted } from '@/components/sections/Trusted'
import { Portfolio } from '@/components/sections/Portfolio'
import { Testimonials } from '@/components/sections/Testimonials'
import { Pricing } from '@/components/sections/Pricing'
import { Contact } from '@/components/sections/Contact'
import { PageAnimations } from '@/components/motion/PageAnimations'
import { Interactions } from '@/components/motion/Interactions'

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
    title: t('home_title'),
    description: t('home_description'),
    alternates: buildAlternates('/', locale),
  }
}

/**
 * Landing. Mismo orden de secciones que legacy/index.html.
 *
 * Todas las secciones son Server Components: lo unico que se envia al cliente
 * son los dos componentes de movimiento, el Header y los contadores.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  return (
    <>
      <main id="main-content">
        <Hero />
        <About />
        <Trusted />
        <Portfolio />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>

      <PageAnimations />
      <Interactions />
    </>
  )
}
