import { testimonials } from '@/data/testimonials'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TestimonialCard } from '@/components/ui/TestimonialCard'

export function Testimonials() {
  return (
    <section className="testimonials" id="testimonials" aria-label="Testimonios de clientes">
      <div className="container">
        <SectionHeader
          tagKey="testimonials.tag"
          titleKey="testimonials.title"
          descKey="testimonials.desc"
        />

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              delay={(index + 1) * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
