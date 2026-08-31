import { useTranslations } from 'next-intl'

interface SkipLinkProps {
  /** Ancla del contenido principal. Todas las paginas marcan su <main>. */
  href?: string
}

/** Salto al contenido principal para navegacion por teclado. */
export function SkipLink({ href = '#main-content' }: SkipLinkProps) {
  const t = useTranslations('misc')

  return (
    <a className="skip-link" href={href}>
      {t('skip_link')}
    </a>
  )
}
