'use client'

import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { cx } from '@/lib/css'
import { FlagEN, FlagES } from '@/components/ui/icons'

const OPTIONS = {
  es: { label: 'ES', ariaLabel: 'Cambiar a Español', Flag: FlagES },
  en: { label: 'EN', ariaLabel: 'Switch to English', Flag: FlagEN },
} as const

/**
 * Selector de idioma ES / EN.
 *
 * `usePathname` de next-intl devuelve la ruta interna sin prefijo de locale,
 * asi que pasarsela a <Link locale="en"> lleva a la misma pagina en el otro
 * idioma: desde /soluciones-de-software se va a /en/software-solutions, no a
 * /en a secas.
 *
 * El prop `locale` se pasa solo en el enlace del idioma inactivo. next-intl
 * prefija la URL cuando el locale va explicito, incluso con
 * `localePrefix: 'as-needed'`, porque necesita que el middleware vea el cambio
 * para actualizar la cookie. En el idioma activo ese prefijo sobra y solo
 * generaria un 307 hacia la URL canonica, asi que se omite.
 *
 * En legacy eran <button> que reescribian el DOM y guardaban el idioma en
 * localStorage. Ahora son enlaces reales, que es lo que necesita el crawler.
 */
export function LangSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="lang-switcher" role="group" aria-label="Selector de idioma">
      {routing.locales.map((code) => {
        const { label, ariaLabel, Flag } = OPTIONS[code]
        const active = code === locale

        return (
          <Link
            key={code}
            href={pathname}
            locale={active ? undefined : code}
            className={cx('lang-btn', active && 'active')}
            aria-label={ariaLabel}
            aria-current={active ? 'true' : undefined}
            hrefLang={code}
          >
            <Flag className="lang-flag" />
            <span>{label}</span>
          </Link>
        )
      })}
    </div>
  )
}
