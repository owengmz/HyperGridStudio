import type { CSSProperties } from 'react'

/**
 * `--delay` como custom property inline.
 *
 * Lo lee PageAnimations con getComputedStyle para escalonar los reveals, igual
 * que hacia legacy con `style="--delay:0.2s"`. El cast existe porque
 * CSSProperties no admite propiedades personalizadas.
 */
export function delayStyle(seconds: number): CSSProperties {
  return { '--delay': `${seconds}s` } as CSSProperties
}

/** Une clases descartando falsy. */
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
