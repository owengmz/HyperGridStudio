import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { buildPageMetadata } from '@/lib/metadata'
import { Link } from '@/i18n/navigation'
import { richTags } from '@/lib/i18n'

const HREF = '/privacidad' as const

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

  const t = await getTranslations({ locale, namespace: 'privacy' })

  return buildPageMetadata({
    href: HREF,
    locale,
    title: t('title'),
    description: t('intro'),
  })
}

/** Bloques numerados de la politica, en el orden en que se muestran. */
const SECTIONS = ['s1', 's2', 's3', 's4'] as const
const WHATSAPP_BLOCKS = [
  'wa_data',
  'wa_use',
  'wa_proc',
  'wa_share',
  'wa_retention',
  'wa_deletion',
] as const
const CLOSING = ['s6', 's7', 's8'] as const

/**
 * Politica de Privacidad.
 *
 * No es un placeholder: el texto completo ya estaba traducido en messages/, asi
 * que se arma la pagina de verdad. La URL vieja (/privacidad.html) esta
 * registrada ante Meta / WhatsApp Business y redirige aca con un 301, con lo
 * cual no puede quedar con contenido provisional.
 */
function PrivacyContent() {
  const t = useTranslations('privacy')

  return (
    <main className="legal" id="main-content">
      <div className="container">
        <div className="legal-card">
          <Link className="legal-back" href="/">
            &larr; <span>{t('back')}</span>
          </Link>

          <h1 className="legal-title">{t('title')}</h1>
          <p className="legal-date">{t('updated')}</p>
          <p className="legal-intro">{t('intro')}</p>

          <div className="legal-body">
            {SECTIONS.map((key) => (
              <section key={key}>
                <h2>{t(`${key}_title`)}</h2>
                <p>{t(`${key}_body`)}</p>
              </section>
            ))}

            <section>
              <h2>{t('wa_title')}</h2>
              <p>{t('wa_intro')}</p>

              {WHATSAPP_BLOCKS.map((key) => (
                <div key={key}>
                  <h3>{t(`${key}_title`)}</h3>
                  <p>{t.rich(`${key}_body`, richTags)}</p>
                </div>
              ))}
            </section>

            {CLOSING.map((key) => (
              <section key={key}>
                <h2>{t(`${key}_title`)}</h2>
                <p>{t.rich(`${key}_body`, richTags)}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)

  return <PrivacyContent />
}
