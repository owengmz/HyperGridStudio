import { useTranslations } from 'next-intl'
import { mainNav, pillars } from '@/data/navigation'
import { Link } from '@/i18n/navigation'
import { cx } from '@/lib/css'

interface MobileMenuProps {
  open: boolean
  /** Prefijo de la home en el locale activo: '/' o '/en'. */
  homeHref: string
  onNavigate: () => void
}

export function MobileMenu({ open, homeHref, onNavigate }: MobileMenuProps) {
  const t = useTranslations()

  return (
    <div
      className={cx('mobile-menu', open && 'open')}
      id="mobileMenu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegacion movil"
      aria-hidden={!open}
    >
      <nav className="mobile-nav" aria-label="Navegacion movil">
        {mainNav.map((item) => (
          <a
            key={item.i18nKey}
            className="mobile-nav-link"
            href={`${homeHref}${item.hash}`}
            onClick={onNavigate}
          >
            {t(item.i18nKey)}
          </a>
        ))}

        {/*
          Los pilares van como lista plana: en movil no hay lugar para el
          desplegable del escritorio, pero las rutas tienen que ser alcanzables.
        */}
        <div className="mobile-nav-group">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              className="mobile-nav-sublink"
              href={pillar.href}
              onClick={onNavigate}
            >
              {t(pillar.i18nKey)}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
