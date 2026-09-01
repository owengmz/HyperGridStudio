import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/metadata'
import { ServicePageContent } from '@/components/sections/ServicePageContent'

/* Ruta interna. El slug publico de cada idioma sale de i18n/routing.ts. */
const HREF = '/automatizaciones' as const
const NAMESPACE = 'pages.automations'

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

  const t = await getTranslations({ locale, namespace: NAMESPACE })

  return buildPageMetadata({
    href: HREF,
    locale,
    /*
      title y description propios de la pagina, no los genericos del layout.
      `absolute` evita que se le aplique el template "%s | Hyper Grid Studio":
      meta.title ya trae la marca.
    */
    title: { absolute: t('meta.title') },
    description: t('meta.description'),
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  /* El JSON-LD (Service + FAQPage) lo emite ServicePageContent a partir del
     namespace, para que cada pagina nueva no tenga que cablearlo. */
  return <ServicePageContent namespace={NAMESPACE} />
}
