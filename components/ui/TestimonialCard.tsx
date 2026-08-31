import { useTranslations } from 'next-intl'
import type { Testimonial } from '@/data/testimonials'
import { delayStyle } from '@/lib/css'
import { GoogleIcon } from '@/components/ui/icons'

interface TestimonialCardProps {
  testimonial: Testimonial
  delay: number
}

export function TestimonialCard({ testimonial, delay }: TestimonialCardProps) {
  const t = useTranslations('testimonials')
  const item = (suffix: string) => `items.${testimonial.id}.${suffix}`

  /* Nombre propio si es una empresa real; si no, el descriptor traducible. */
  const company = testimonial.company ?? t(item('company'))

  return (
    <article className="testimonial-card reveal-up" style={delayStyle(delay)}>
      <div className="testimonial-header">
        <GoogleIcon className="testimonial-google-icon" />
        <span className="testimonial-stars" aria-label={t('stars_aria')}>
          {'★'.repeat(testimonial.rating)}
        </span>
      </div>

      <blockquote className="testimonial-text">{t(item('quote'))}</blockquote>

      <hr className="testimonial-divider" aria-hidden="true" />

      <div className="testimonial-author">
        <div className="testimonial-avatar-wrap">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="testimonial-photo"
              width={48}
              height={48}
              loading="lazy"
            />
          ) : (
            /* Sin foto: el fallback de iniciales, que el CSS oculta por
               defecto, se muestra directamente. En legacy esto dependia de un
               onerror inline que disparaba tras el 404 de la imagen. */
            <div
              className="testimonial-avatar-fallback"
              style={{ display: 'flex' }}
              aria-hidden="true"
            >
              {testimonial.initials}
            </div>
          )}
        </div>

        <div className="testimonial-author-info">
          <p className="testimonial-name">{testimonial.author}</p>
          <p className="testimonial-company">{company}</p>
          <p className="testimonial-role">{t(item('role'))}</p>
        </div>
      </div>
    </article>
  )
}
