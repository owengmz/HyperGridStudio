import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/metadata'
import { PlaceholderSection } from '@/components/sections/PlaceholderSection'

/* Ruta interna. El slug publico de cada idioma sale de i18n/routing.ts. */
const HREF = '/automatizaciones/whatsapp' as const
const NAMESPACE = 'pages.automations_whatsapp'

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
    title: t('title'),
    description: t('description'),
  })
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: NAMESPACE })

  return <PlaceholderSection href={HREF} title={t('title')} description={t('description')} />
}
