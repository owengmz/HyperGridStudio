/**
 * Tarjetas de servicio de la seccion "Nosotros / Servicios".
 *
 * El diccionario legacy usaba claves card1/card2/card4/card5 (con un hueco en
 * card3, sobrante de una tarjeta eliminada). Aca son un array plano de 4 items
 * con ids semanticos estables; la numeracion rota no se arrastra.
 * Los textos viven en messages/*.json bajo `services.cards.<id>`.
 */

export type ServiceId = 'landing' | 'ecommerce' | 'seo' | 'automation'

export interface Service {
  id: ServiceId
  /** Nombre del icono en Material Symbols Outlined. */
  icon: string
  /** Ruta de las traducciones de esta tarjeta (`.title` y `.body`). */
  i18nKey: `services.cards.${ServiceId}`
}

export const services: readonly Service[] = [
  {
    id: 'landing',
    icon: 'web',
    i18nKey: 'services.cards.landing',
  },
  {
    id: 'ecommerce',
    icon: 'shopping_bag',
    i18nKey: 'services.cards.ecommerce',
  },
  {
    id: 'seo',
    icon: 'speed',
    i18nKey: 'services.cards.seo',
  },
  {
    // OJO: en legacy este icono no renderiza. `smart_toy` quedo fuera del
    // subset `&text=` con el que se carga Material Symbols en el <head>.
    // Al portar la carga de iconos hay que incluirlo (o migrar a lucide-react).
    id: 'automation',
    icon: 'smart_toy',
    i18nKey: 'services.cards.automation',
  },
]
