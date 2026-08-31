import { useTranslations } from 'next-intl'
import { richTags, type MessageKey } from '@/lib/i18n'

interface SectionHeaderProps {
  tagKey: MessageKey
  titleKey: MessageKey
  descKey: MessageKey
}

/** Cabecera comun de seccion: etiqueta, titulo con acento y bajada. */
export function SectionHeader({ tagKey, titleKey, descKey }: SectionHeaderProps) {
  const t = useTranslations()

  return (
    <div className="section-header reveal-up">
      <span className="section-tag">{t(tagKey)}</span>
      <h2 className="section-title">{t.rich(titleKey, richTags)}</h2>
      <p className="section-desc">{t(descKey)}</p>
    </div>
  )
}
