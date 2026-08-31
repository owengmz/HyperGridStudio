import { ImageResponse } from 'next/og'
import { site } from '@/data/site'

/**
 * Imagen Open Graph generada en build con next/og.
 *
 * Reemplaza a /img/og-preview.png, que estaba referenciada en el <head> de
 * legacy pero no existia en el repo: la preview social del sitio no cargaba en
 * ningun lado (WhatsApp, LinkedIn, X, Facebook).
 *
 * Vive en la raiz de app/ y no dentro de [locale] para que valga como default
 * de todas las rutas por herencia de metadata, sin depender del segmento de
 * idioma. Por eso el middleware la excluye de su matcher.
 *
 * Los textos van fijos en espanol: es el idioma por defecto y la imagen es
 * unica para todo el sitio. Una variante por locale entra cuando se decida si
 * hace falta.
 */

export const alt = 'Hyper Grid Studio — Soluciones web modernas y de alto rendimiento'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/* Tokens copiados de :root en globals.css. No se pueden importar del CSS: el
   render corre en satori, que no evalua hojas de estilo. */
const BG = '#0d0b14'
const PRIMARY = '#7c3aed'
const PRIMARY_LIGHT = '#a78bfa'
const TEXT = '#f0f4f8'
const TEXT_DIM = '#9ab0c2'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: BG,
          backgroundImage: `radial-gradient(900px circle at 80% 15%, ${PRIMARY}55, transparent 60%), radial-gradient(700px circle at 10% 95%, ${PRIMARY}33, transparent 55%)`,
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 999,
              background: PRIMARY_LIGHT,
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: TEXT_DIM,
            }}
          >
            {site.domain}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: TEXT,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            {site.name}
          </div>

          <div style={{ display: 'flex', fontSize: 40, color: PRIMARY_LIGHT, lineHeight: 1.25 }}>
            Páginas web que convierten
          </div>

          <div style={{ display: 'flex', fontSize: 32, color: TEXT_DIM, lineHeight: 1.35 }}>
            Desarrollo web · Soluciones de software · Automatizaciones
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: 26,
            color: TEXT_DIM,
          }}
        >
          {/*
            Sin el caracter ★: la fuente por defecto de satori no trae ese
            glifo y se renderiza como caja vacia. Se muestra la nota numerica.
          */}
          <div style={{ display: 'flex', color: '#f59e0b', fontWeight: 700 }}>
            {site.googleReviews.rating.toFixed(1)}
          </div>
          <div style={{ display: 'flex' }}>
            {site.googleReviews.count} Google Reviews · {site.address.locality},{' '}
            {site.address.countryName}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
