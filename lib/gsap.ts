'use client'

/**
 * Punto unico de registro de GSAP.
 *
 * registerPlugin es idempotente, pero centralizarlo evita que cada componente
 * cliente tenga que acordarse de registrar ScrollTrigger y useGSAP.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export { gsap, ScrollTrigger, useGSAP }
