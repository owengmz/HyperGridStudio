import { useLocale, useTranslations } from 'next-intl'
import { footerAnchors, footerRoutes } from '@/data/navigation'
import { site } from '@/data/site'
import { Link, getPathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

export function Footer() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const homeHref = getPathname({ href: '/', locale })

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer-inner">
        <Link className="logo" href="/" aria-label={`${site.name} - volver al inicio`}>
          <img
            src="/img/logo.webp"
            alt={site.logoAlt}
            className="logo-icon"
            width={120}
            height={48}
            loading="lazy"
          />
        </Link>

        <nav className="footer-nav" aria-label="Navegacion del pie de pagina">
          {footerAnchors.map((item) => (
            <a key={item.i18nKey} href={`${homeHref}${item.hash}`}>
              {t(item.i18nKey)}
            </a>
          ))}

          {footerRoutes.map((item) => (
            <Link key={item.i18nKey} href={item.href}>
              {t(item.i18nKey)}
            </Link>
          ))}
        </nav>

        <p className="footer-copy">
          <small>{t('footer.copy')}</small>
        </p>
      </div>
    </footer>
  )
}
