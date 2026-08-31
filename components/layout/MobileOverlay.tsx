import { cx } from '@/lib/css'

interface MobileOverlayProps {
  /** Controla `display`: se monta antes de arrancar el fade in. */
  mounted: boolean
  /** Controla la clase `.open`, que es la que anima la opacidad. */
  open: boolean
  onClick: () => void
  onTransitionEnd: () => void
}

/**
 * Fondo oscuro que cierra el menu movil.
 *
 * `mounted` y `open` van separados a proposito: el CSS trae `display: none` y
 * una transicion de opacidad, asi que hay que pintar el elemento un frame antes
 * de agregar `.open` para que el navegador tenga desde donde animar. Es la
 * misma secuencia que hacia legacy con requestAnimationFrame.
 */
export function MobileOverlay({ mounted, open, onClick, onTransitionEnd }: MobileOverlayProps) {
  return (
    <div
      className={cx('mobile-overlay', open && 'open')}
      id="mobileOverlay"
      aria-hidden="true"
      style={mounted ? { display: 'block' } : undefined}
      onClick={onClick}
      onTransitionEnd={onTransitionEnd}
    />
  )
}
