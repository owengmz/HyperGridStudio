import { useTranslations } from 'next-intl'
import { projects, type ProjectId } from '@/data/portfolio'
import { MaterialIcon } from '@/components/ui/icons'

/** Icono de Material Symbols por cliente. */
const CLIENT_ICONS: Record<ProjectId, string> = {
  zycor: 'engineering',
  wood: 'auto_awesome',
}

/**
 * Franja de clientes.
 *
 * En legacy era un marquee infinito con cinco items duplicados, de los cuales
 * cuatro eran inventados (TechFlow, SkyNet, Venture X, SecureBase). Sacados
 * esos, quedan los dos clientes reales, que se leen de data/portfolio.
 *
 * Con dos nombres el marquee no funciona: la animacion desplaza el contenedor
 * -50% asumiendo dos copias del set, y dos items duplicados no llegan a cubrir
 * el ancho del viewport, con lo que se ve el hueco y el salto del loop en cada
 * vuelta. Se muestran como fila estatica centrada hasta que haya suficientes
 * logos; la decision visual definitiva es de la Etapa 3.
 */
export function Trusted() {
  const t = useTranslations('trusted')

  return (
    <section className="trusted" aria-label="Empresas que confian en nosotros">
      <div className="container">
        <p className="trusted-label">{t('label')}</p>

        <div className="trusted-logos">
          {projects.map((project) => (
            <div className="marquee-item" key={project.id}>
              <MaterialIcon name={CLIENT_ICONS[project.id]} /> {project.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
