/**
 * Planes de precios.
 *
 * El orden del array es el orden visual: el plan destacado va al medio, como
 * en el sitio actual. Los textos viven en messages/*.json bajo
 * `pricing.plans.<id>`, incluidas las listas de features.
 */

export type PlanId = 'store' | 'landing' | 'custom'

export interface PlanPrice {
  /** null = "a consultar": el importe se lee de `pricing.plans.<id>.amount`. */
  amount: number | null
  currency: 'USD'
  /** Importe ya formateado tal como se muestra ("$800"). null si es a consultar. */
  display: string | null
}

export interface PricingPlan {
  id: PlanId
  /** Nombre del icono en Material Symbols Outlined. */
  icon: string
  /** Aplica el estilo destacado y muestra el badge "Mas Popular". */
  featured: boolean
  price: PlanPrice
  /** Ruta de las traducciones (`.name`, `.period`, `.desc`, `.features[]`, `.cta`). */
  i18nKey: `pricing.plans.${PlanId}`
}

export const plans: readonly PricingPlan[] = [
  {
    id: 'store',
    // NOTA: en legacy los iconos de "store" y "landing" estan invertidos
    // (rocket_launch en la tienda, storefront en la landing). Se preserva el
    // comportamiento actual; corregirlo es una decision de diseno.
    icon: 'rocket_launch',
    featured: false,
    price: { amount: 800, currency: 'USD', display: '$800' },
    i18nKey: 'pricing.plans.store',
  },
  {
    id: 'landing',
    icon: 'storefront',
    featured: true,
    price: { amount: 150, currency: 'USD', display: '$150' },
    i18nKey: 'pricing.plans.landing',
  },
  {
    id: 'custom',
    icon: 'auto_awesome',
    featured: false,
    price: { amount: null, currency: 'USD', display: null },
    i18nKey: 'pricing.plans.custom',
  },
]

/** Rango de precios para el JSON-LD de Schema.org, derivado de los planes. */
export const priceRange = '$150 - $800+'
