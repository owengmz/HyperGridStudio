import { useTranslations } from 'next-intl'
import { site, whatsappUrl } from '@/data/site'
import { WhatsAppFloatIcon } from '@/components/ui/icons'

/** Boton flotante de WhatsApp, presente en todas las paginas. */
export function WhatsAppFloat() {
  const t = useTranslations('misc')

  return (
    <a
      className="whatsapp-float"
      href={whatsappUrl(site.whatsapp.messages.floating)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp_float')}
    >
      <WhatsAppFloatIcon />
    </a>
  )
}
