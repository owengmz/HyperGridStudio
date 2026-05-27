/* ============================================
   Hyper Grid Studio — i18n.js
   Sistema de internacionalización ES / EN
   Todas las claves de texto visible de la página
============================================ */

export const translations = {

  /* ─── ESPAÑOL (default) ─── */
  es: {
    misc: {
      skip_link:      'Saltar al contenido principal',
      whatsapp_float: 'Contactar por WhatsApp',
    },

    nav: {
      about:     'Nosotros',
      services:  'Servicios',
      portfolio: 'Portafolio',
      pricing:   'Precios',
      contact:   'Contacto',
      cta:       'Contrátame',
    },

    hero: {
      badge_available:      'Disponible para nuevos proyectos',
      badge_reviews:        '50+ Google Reviews',
      title_line1:          'Páginas web que',
      /* data-i18n-html — contiene <br> */
      title_accent:         'convierten visitantes<br>en clientes reales',
      /* data-i18n-html — contiene &nbsp; ( ) */
      desc:                 'Diseño y desarrollamos tu sitio en menos de 10 días, con foco en resultados medibles: más consultas, más ventas, más confianza para tu negocio.',
      cta_primary:          'Ver Portafolio',
      cta_whatsapp:         'Cotizar por WhatsApp',
      stat_projects:        'Proyectos',
      stat_delivery_suffix: ' días',
      stat_delivery_label:  'Entrega',
      stat_rating:          'Calificación',
    },

    about: {
      tag:  'Lo que Hacemos',
      /* data-i18n-html — contiene <span class="text-accent"> */
      title: 'Soluciones <span class="text-accent">Digitales</span>',
      desc:  'Cada proyecto es construido a medida con las últimas tecnologías, enfocado en resultados reales para tu negocio.',
      stat1: 'Años de Experiencia',
      stat2: 'Proyectos Entregados',
      stat3: 'Clientes Satisfechos',
      stat4: 'Soporte Disponible',
    },

    trusted: {
      label: 'CON LA CONFIANZA DE LÍDERES DE LA INDUSTRIA',
    },

    services: {
      tag:  'Lo que hago',
      /* data-i18n-html */
      title: 'Servicios <span class="text-accent">Premium</span>',
      desc:  'Cada proyecto es construido con las últimas tecnologías y mejores prácticas para garantizar resultados excepcionales.',
      card1_title: 'Landing Page que Vende',
      card1_body:  'Tu negocio online en menos de 10 días. Diseño profesional que transmite confianza y convierte visitas en consultas reales desde el primer día.',
      card2_title: 'Tienda Online que Crece',
      card2_body:  'Vendé las 24 hs sin intermediarios. Tus clientes compran fácil, vos cobrás rápido y manejás todo desde un panel sin necesidad de conocimientos técnicos.',
      card4_title: 'Mejor Posición en Google',
      card4_body:  'Un sitio lento pierde clientes antes de que lean tu propuesta. Optimizamos velocidad y SEO para que aparezcas primero cuando tu cliente te busca.',
      card5_title: 'Automatizaciones para tu Negocio',
      card5_body:  'Sistemas de reserva de turnos y gestión de pedidos online para que tu negocio trabaje solo mientras vos te enfocás en lo que importa.',
    },

    portfolio: {
      tag:  'Portafolio',
      /* data-i18n-html */
      title: 'Proyectos <span class="text-accent">Destacados</span>',
      desc:  'Una selección de proyectos reales que reflejan calidad, atención al detalle y resultados concretos para cada cliente.',
      zycor_category: 'Construcción',
      zycor_desc: 'Landing page bilingüe (EN/ES) para constructora especializada en Framing, Renovaciones y Roofing en New Jersey, USA.',
      zycor_btn:  'Ver Proyecto',
      wood_category: 'Carpintería',
      wood_soon:  'Próximamente',
      wood_desc:  'Sitio web para carpintería artesanal especializada en muebles a medida — cocinas, closets, baños y escritorios. Diseño con galería filtrable por categorías.',
      wood_btn:   'Próximamente',
    },

    testimonials: {
      tag:  'Testimonios',
      /* data-i18n-html */
      title: 'Lo que dicen nuestros <span class="text-accent">Clientes</span>',
      desc:  'La satisfacción de nuestros clientes es nuestra mejor carta de presentación.',
      t1_quote: '"Superaron todas mis expectativas. El sitio quedó exactamente como lo imaginaba, y la comunicación durante todo el proceso fue excelente. Desde el primer día empezamos a recibir consultas."',
      t1_role:  'CEO · New Jersey, USA',
      t2_quote: '"Profesionalismo de principio a fin. Entendieron la esencia de mi negocio y la plasmaron perfectamente en el diseño. El panel de administración me permite actualizar todo sin necesitar ayuda externa."',
      t2_role:  'Fundador · Argentina',
      t3_quote: '"Rápidos, eficientes y con un ojo increíble para el detalle. Mi landing page convierte visitantes en clientes todos los días. La entregaron en 7 días exactos, tal como prometieron."',
      t3_role:  'E-commerce · Argentina',
    },

    pricing: {
      tag:  'Inversión',
      /* data-i18n-html */
      title: 'Precios <span class="text-accent">Transparentes</span>',
      desc:  'Desde una página simple hasta proyectos 100% personalizados. Sin sorpresas, sin letras chicas.',
      plan1_name:   'Tienda Online',
      plan1_period: 'Usd · Precio según complejidad',
      plan1_desc:   'Perfecto para negocios de ropa, accesorios o cualquier producto físico que quiera vender online.',
      plan1_f1:  'Hasta 20 productos',
      plan1_f2:  'Pasarela de pagos integrada',
      plan1_f3:  'Panel de administración',
      plan1_f4:  'Gestión de inventario',
      plan1_f5:  '1 mes de soporte incluido',
      plan1_cta: 'Quiero mi Tienda',
      plan2_badge:  'Más Popular',
      plan2_name:   'Landing Page',
      plan2_period: 'Usd · oferta única',
      plan2_desc:   'Ideal para emprendedores, profesionales y cualquier persona que necesite presencia online rápida.',
      plan2_f1:  'Diseño de página única',
      plan2_f2:  'Adaptable a móviles (responsive)',
      plan2_f3:  'Botón de WhatsApp y redes sociales',
      plan2_f4:  'Formulario de contacto',
      plan2_f5:  'Entrega en menos de 7 días',
      plan2_cta: 'Quiero mi Landing',
      plan3_name:   'Proyecto Personalizado',
      plan3_amount: 'A consultar',
      plan3_period: 'según complejidad',
      plan3_desc:   'Para ideas únicas: llaveros QR con perfil de mascota, directorios, reservas, portafolios especiales y más.',
      plan3_f1:  'Funcionalidad 100% a medida',
      plan3_f2:  'Base de datos si se necesita',
      plan3_f3:  'Panel de administración',
      plan3_f4:  'Optimización de velocidad',
      plan3_f5:  '3 meses de soporte',
      plan3_cta: 'Contarme mi idea',
    },

    contact: {
      tag:  'Contacto',
      /* data-i18n-html */
      title: 'Empecemos tu <span class="text-accent">proyecto</span>',
      desc:  '¿Listo para transformar tu visión en realidad? Conectate con nosotros a través de tu plataforma favorita.',
      whatsapp_btn:           'Chat por WhatsApp',
      form_name_label:        'Nombre Completo',
      form_name_placeholder:  'Juan Pérez',
      form_email_label:       'Correo Electrónico',
      form_email_placeholder: 'juan@ejemplo.com',
      form_msg_label:         'Detalles del Proyecto',
      form_msg_placeholder:   'Cuéntame sobre tu proyecto...',
      form_submit:            'Enviar Mensaje',
      form_sending:           'Enviando...',
      form_success:           '¡Mensaje enviado! Te responderé pronto.',
      form_error:             'Hubo un error al enviar. Por favor intenta de nuevo o escribe directamente a WhatsApp.',
    },

    footer: {
      about:    'Sobre Nosotros',
      services: 'Servicios',
      portfolio:'Portafolio',
      privacy:  'Política de Privacidad',
      copy:     '© 2026 Hyper Grid Studio. Todos los derechos reservados.',
    },
  },

  /* ─── ENGLISH ─── */
  en: {
    misc: {
      skip_link:      'Skip to main content',
      whatsapp_float: 'Contact via WhatsApp',
    },

    nav: {
      about:     'About',
      services:  'Services',
      portfolio: 'Portfolio',
      pricing:   'Pricing',
      contact:   'Contact',
      cta:       'Hire Me',
    },

    hero: {
      badge_available:      'Available for new projects',
      badge_reviews:        '50+ Google Reviews',
      title_line1:          'Websites that',
      title_accent:         'turn visitors into<br>real clients',
      desc:                 'We design and build your site in under 10 days, focused on measurable results: more inquiries, more sales, more trust for your business.',
      cta_primary:          'View Portfolio',
      cta_whatsapp:         'Get a Quote on WhatsApp',
      stat_projects:        'Projects',
      stat_delivery_suffix: ' days',
      stat_delivery_label:  'Delivery',
      stat_rating:          'Rating',
    },

    about: {
      tag:  'What We Do',
      title: 'Digital <span class="text-accent">Solutions</span>',
      desc:  'Every project is built custom with the latest technologies, focused on real results for your business.',
      stat1: 'Years of Experience',
      stat2: 'Projects Delivered',
      stat3: 'Satisfied Clients',
      stat4: 'Support Available',
    },

    trusted: {
      label: 'TRUSTED BY INDUSTRY LEADERS',
    },

    services: {
      tag:  'What I do',
      title: 'Premium <span class="text-accent">Services</span>',
      desc:  'Every project is built with the latest technologies and best practices to guarantee exceptional results.',
      card1_title: 'Landing Pages that Convert',
      card1_body:  'Your business online in under 10 days. Professional design that builds trust and turns visits into real inquiries from day one.',
      card2_title: 'Online Store that Grows',
      card2_body:  'Sell 24/7 with no middlemen. Your clients buy easily, you get paid fast and manage everything from a panel without any technical knowledge.',
      card4_title: 'Better Google Ranking',
      card4_body:  'A slow site loses clients before they read your offer. We optimize speed and SEO so you appear first when your client searches for you.',
      card5_title: 'Automations for Your Business',
      card5_body:  'Appointment booking and online order management systems so your business runs on autopilot while you focus on what matters.',
    },

    portfolio: {
      tag:  'Portfolio',
      title: 'Featured <span class="text-accent">Projects</span>',
      desc:  'A selection of real projects that reflect quality, attention to detail and concrete results for each client.',
      zycor_category: 'Construction',
      zycor_desc: 'Bilingual (EN/ES) landing page for a construction company specialized in Framing, Renovations and Roofing in New Jersey, USA.',
      zycor_btn:  'View Project',
      wood_category: 'Carpentry',
      wood_soon:  'Coming Soon',
      wood_desc:  'Website for an artisan carpentry shop specialized in custom furniture — kitchens, closets, bathrooms and desks. Design with a filterable gallery by category.',
      wood_btn:   'Coming Soon',
    },

    testimonials: {
      tag:  'Testimonials',
      title: 'What our <span class="text-accent">Clients</span> say',
      desc:  "Our clients' satisfaction is our best presentation letter.",
      t1_quote: '"They exceeded all my expectations. The site turned out exactly as I imagined, and communication throughout the process was excellent. From day one we started receiving inquiries."',
      t1_role:  'CEO · New Jersey, USA',
      t2_quote: '"Professionalism from start to finish. They understood the essence of my business and captured it perfectly in the design. The admin panel lets me update everything without outside help."',
      t2_role:  'Founder · Argentina',
      t3_quote: '"Fast, efficient and with an incredible eye for detail. My landing page converts visitors into clients every day. They delivered it in exactly 7 days, just as promised."',
      t3_role:  'E-commerce · Argentina',
    },

    pricing: {
      tag:  'Investment',
      title: 'Transparent <span class="text-accent">Pricing</span>',
      desc:  'From a simple page to 100% custom projects. No surprises, no fine print.',
      plan1_name:   'Online Store',
      plan1_period: 'USD · Price based on complexity',
      plan1_desc:   'Perfect for clothing, accessories or any physical product business that wants to sell online.',
      plan1_f1:  'Up to 20 products',
      plan1_f2:  'Integrated payment gateway',
      plan1_f3:  'Admin panel',
      plan1_f4:  'Inventory management',
      plan1_f5:  '1 month of support included',
      plan1_cta: 'I want my Store',
      plan2_badge:  'Most Popular',
      plan2_name:   'Landing Page',
      plan2_period: 'USD · unique offer',
      plan2_desc:   'Ideal for entrepreneurs, professionals and anyone who needs a fast online presence.',
      plan2_f1:  'Single page design',
      plan2_f2:  'Mobile-friendly (responsive)',
      plan2_f3:  'WhatsApp button and social media',
      plan2_f4:  'Contact form',
      plan2_f5:  'Delivery in less than 7 days',
      plan2_cta: 'I want my Landing',
      plan3_name:   'Custom Project',
      plan3_amount: 'Quote on request',
      plan3_period: 'based on complexity',
      plan3_desc:   'For unique ideas: QR keychains with pet profiles, directories, bookings, special portfolios and more.',
      plan3_f1:  '100% custom functionality',
      plan3_f2:  'Database if needed',
      plan3_f3:  'Admin panel',
      plan3_f4:  'Speed optimization',
      plan3_f5:  '3 months of support',
      plan3_cta: 'Tell me about my idea',
    },

    contact: {
      tag:  'Contact',
      title: "Let's start your <span class=\"text-accent\">project</span>",
      desc:  'Ready to turn your vision into reality? Connect with us through your favorite platform.',
      whatsapp_btn:           'Chat on WhatsApp',
      form_name_label:        'Full Name',
      form_name_placeholder:  'John Doe',
      form_email_label:       'Email Address',
      form_email_placeholder: 'john@example.com',
      form_msg_label:         'Project Details',
      form_msg_placeholder:   'Tell me about your project...',
      form_submit:            'Send Message',
      form_sending:           'Sending...',
      form_success:           "Message sent! I'll get back to you soon.",
      form_error:             'There was an error sending. Please try again or write directly on WhatsApp.',
    },

    footer: {
      about:    'About Us',
      services: 'Services',
      portfolio:'Portfolio',
      privacy:  'Privacy Policy',
      copy:     '© 2026 Hyper Grid Studio. All rights reserved.',
    },
  },
};
