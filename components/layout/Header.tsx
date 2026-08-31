'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { mainNav, pillars } from '@/data/navigation'
import { site } from '@/data/site'
import { Link, getPathname } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { cx } from '@/lib/css'
import { MaterialIcon } from '@/components/ui/icons'
import { LangSwitcher } from '@/components/layout/LangSwitcher'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { MobileOverlay } from '@/components/layout/MobileOverlay'

/** Tinte RGB del header segun la seccion visible (bloque 10 de legacy/script.js). */
const SECTION_TINTS: Record<string, string> = {
  hero: '20, 10, 36',
  about: '10, 18, 36',
  portfolio: '8,  14, 28',
  testimonials: '20, 8,  32',
  pricing: '10, 16, 32',
  contact: '13, 11, 20',
}

const DEFAULT_TINT = '13, 11, 20'

export function Header() {
  const t = useTranslations()
  const locale = useLocale() as Locale

  /* Las anclas se emiten absolutas ('/#about', '/en#about') para que tambien
     funcionen desde las paginas de pilares. Dentro de la home el navegador lo
     resuelve como salto de fragmento, sin recargar. */
  const homeHref = getPathname({ href: '/', locale })

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [overlayMounted, setOverlayMounted] = useState(false)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    setOverlayOpen(false)
  }, [])

  const toggleMenu = useCallback(() => {
    setMenuOpen((open) => {
      if (open) {
        setOverlayOpen(false)
        return false
      }
      setOverlayMounted(true)
      /* Un frame despues de pintar el overlay se activa la clase que anima. */
      requestAnimationFrame(() => setOverlayOpen(true))
      return true
    })
  }, [])

  /* Header transparente hasta el primer pixel de scroll. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Tinte del header segun la seccion que ocupa el viewport. */
  useEffect(() => {
    const header = document.getElementById('header')
    if (!header) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const tint = SECTION_TINTS[entry.target.id] ?? DEFAULT_TINT
          header.style.setProperty('--header-tint', tint)
        })
      },
      { threshold: 0.25 },
    )

    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  /* Escape cierra el menu; mientras esta abierto se bloquea el scroll. */
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [menuOpen, closeMenu])

  /* El desplegable se cierra con Escape o al hacer foco/clic fuera. */
  useEffect(() => {
    if (!servicesOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setServicesOpen(false)
    }

    const onFocusOrClickOutside = (event: Event) => {
      const target = event.target as Node | null
      if (target && !dropdownRef.current?.contains(target)) setServicesOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusOrClickOutside)
    document.addEventListener('pointerdown', onFocusOrClickOutside)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusOrClickOutside)
      document.removeEventListener('pointerdown', onFocusOrClickOutside)
    }
  }, [servicesOpen])

  return (
    <>
      <header className={cx('header', scrolled && 'header-scrolled')} id="header" role="banner">
        <div className="container header-inner">
          <Link className="logo" href="/" aria-label={`${site.name} - Inicio`}>
            <Image
              src="/img/logo.webp"
              alt={site.logoAlt}
              className="logo-icon"
              width={210}
              height={141}
              priority
            />
          </Link>

          <nav className="nav" id="nav" role="navigation" aria-label="Navegacion principal">
            {mainNav.map((item) => (
              <a key={item.i18nKey} className="nav-link" href={`${homeHref}${item.hash}`}>
                {t(item.i18nKey)}
              </a>
            ))}

            {/*
              Desplegable con los tres pilares y sus subpaginas. Es lo que evita
              que esas ocho rutas queden sin ningun enlace interno.
            */}
            <div
              className="nav-dropdown"
              ref={dropdownRef}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="nav-link nav-dropdown-trigger"
                aria-expanded={servicesOpen}
                aria-controls="nav-services-menu"
                onClick={() => setServicesOpen((open) => !open)}
              >
                {t('nav.services')}
                <MaterialIcon name="expand_more" />
              </button>

              <div
                className={cx('nav-dropdown-menu', servicesOpen && 'open')}
                id="nav-services-menu"
              >
                {pillars.map((pillar) => (
                  <div className="nav-dropdown-group" key={pillar.href}>
                    <Link
                      className="nav-dropdown-hub"
                      href={pillar.href}
                      onClick={() => setServicesOpen(false)}
                    >
                      {t(pillar.i18nKey)}
                    </Link>

                    {pillar.children.map((child) => (
                      <Link
                        className="nav-dropdown-child"
                        key={child.href}
                        href={child.href}
                        onClick={() => setServicesOpen(false)}
                      >
                        {t(child.i18nKey)}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </nav>

          <div className="header-actions">
            <LangSwitcher />

            <a className="btn btn-primary" href={`${homeHref}#contact`}>
              {t('nav.cta')}
            </a>

            <button
              className={cx('hamburger', menuOpen && 'open')}
              id="hamburger"
              type="button"
              aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              aria-controls="mobileMenu"
              onClick={toggleMenu}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} homeHref={homeHref} onNavigate={closeMenu} />

      <MobileOverlay
        mounted={overlayMounted}
        open={overlayOpen}
        onClick={closeMenu}
        onTransitionEnd={() => {
          /* Recien cuando termina el fade out se saca del flujo. */
          if (!overlayOpen) setOverlayMounted(false)
        }}
      />
    </>
  )
}
