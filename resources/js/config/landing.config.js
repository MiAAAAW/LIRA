/**
 * @fileoverview Landing Page Configuration
 * @description Centralized config for Pandilla Lira Puno - Danza Folklórica
 * @type {import('@/types/landing.types').LandingConfig}
 */

export const landingConfig = {
  // ═══════════════════════════════════════════════════════════════════════════════
  // UI STRINGS
  // ═══════════════════════════════════════════════════════════════════════════════
  ui: {
    readMore: "Leer más",
    viewAll: "Ver todo",
    subscribe: "Suscribirse",
    loading: "Cargando...",
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    toggleMenu: "Abrir menú",
    search: "Buscar",
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SITE METADATA
  // ═══════════════════════════════════════════════════════════════════════════════
  site: {
    name: "Pandilla Lira Puno",
    description: "Conjunto Pandillero Lira Puno - Patrimonio Cultural de la Nación. Tradición, elegancia y pasión por la Pandilla Puneña desde 1926.",
    url: "https://pandillalirapuno.pe",
    ogImage: "/images/og-pandilla-lira.png",
    keywords: ["pandilla puneña", "lira puno", "danza folklórica", "carnaval puno", "patrimonio cultural", "estudiantina", "puno perú"],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════════
  navigation: {
    logo: {
      text: "Lira Puno",
      icon: "Music",
      href: "/",
    },
    items: [
      { label: "Inicio", href: "#" },
      { label: "Historia", href: "#historia" },
      { label: "La Danza", href: "#danza" },
      { label: "Eventos", href: "#eventos" },
      { label: "Galería", href: "#galeria" },
      { label: "Contacto", href: "#contacto" },
    ],
    cta: {
      text: "Únete",
      href: "#contacto",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // HERO SECTION
  // ═══════════════════════════════════════════════════════════════════════════════
  hero: {
    badge: {
      text: "Patrimonio Cultural de la Nación",
      variant: "outline",
    },
    title: {
      main: "Conjunto Pandillero",
      highlight: "Lira Puno",
      suffix: "",
    },
    description: "Desde 1926 preservamos la tradición de la Pandilla Puneña, la reina de las danzas del altiplano. Elegancia, pasión y el espíritu del carnaval puneño viven en cada paso.",
    cta: {
      primary: {
        text: "Conoce Nuestra Historia",
        href: "#historia",
      },
      secondary: {
        text: "Ver Eventos",
        href: "#eventos",
      },
    },
    image: {
      src: "/images/hero-pandilla.jpg",
      alt: "Pandilla Lira Puno - Danza tradicional",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FEATURED NEWS → HISTORIA
  // ═══════════════════════════════════════════════════════════════════════════════
  featuredNews: {
    badge: "Nuestra Historia",
    title: "Tradición desde 1926",
    subtitle: "Casi un siglo preservando la esencia de la Pandilla Puneña",
    items: [
      {
        id: "1",
        title: "Los Orígenes: 1907 - El Nacimiento de la Pandilla",
        excerpt: "Manuel Montesinos crea la primera estudiantina formal en Puno, dando forma definitiva a la pandilla puneña con instrumentos de cuerda, acordeón y quena.",
        date: "1907-01-01",
        category: "Orígenes",
        image: "/images/historia/origenes.jpg",
        href: "#historia",
        author: "Archivo Histórico",
        featured: true,
      },
      {
        id: "2",
        title: "Fundación de Lira Puno - 1926",
        excerpt: "En casa de Lorenzo Rojas Rocha, entre la calle Arequipa y Fermín Arbulú, nace formalmente el Conjunto Musical 'Lira Puno' y su primera pandilla.",
        date: "1926-01-01",
        category: "Fundación",
        image: "/images/historia/fundacion.jpg",
        href: "#historia",
        author: "Archivo Lira Puno",
      },
      {
        id: "3",
        title: "Patrimonio Cultural de la Nación - 2012",
        excerpt: "Mediante Resolución Viceministerial Nº 046-2012, la Pandilla Puneña es declarada Patrimonio Cultural de la Nación por su valor artístico.",
        date: "2012-08-20",
        category: "Reconocimiento",
        image: "/images/historia/patrimonio.jpg",
        href: "#historia",
        author: "Ministerio de Cultura",
      },
      {
        id: "4",
        title: "Camino a Patrimonio de la Humanidad",
        excerpt: "La pandilla puneña busca el reconocimiento de la UNESCO como Patrimonio Cultural Inmaterial de la Humanidad.",
        date: "2024-01-01",
        category: "Actualidad",
        image: "/images/historia/unesco.jpg",
        href: "#historia",
        author: "Comité Pro-UNESCO",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // CATEGORIES → LA DANZA
  // ═══════════════════════════════════════════════════════════════════════════════
  categories: {
    badge: "La Danza",
    title: "Elementos de la Pandilla Puneña",
    subtitle: "Conoce cada aspecto de la reina de las danzas puneñas",
    columns: 3,
    items: [
      {
        id: "1",
        name: "El Bastonero",
        description: "Guía de la pandilla, el más experimentado. Dirige las mudanzas con voz de mando y elegancia.",
        icon: "Crown",
        href: "#danza",
        color: "indigo",
        articleCount: null,
      },
      {
        id: "2",
        name: "La Estudiantina",
        description: "Conjunto musical de cuerdas: mandolina, bandurrias, guitarras, guitarrón, charango, acordeón y quena.",
        icon: "Music",
        href: "#danza",
        color: "violet",
        articleCount: null,
      },
      {
        id: "3",
        name: "Las Mudanzas",
        description: "Figuras coreográficas elegantes y discretas que las parejas ejecutan al compás del huayño pandillero.",
        icon: "Footprints",
        href: "#danza",
        color: "emerald",
        articleCount: null,
      },
      {
        id: "4",
        name: "Vestimenta Femenina",
        description: "Blusa de seda, mantón de pecho, pollera de terciopelo, sombrero de hongo y botines blancos.",
        icon: "Sparkles",
        href: "#danza",
        color: "pink",
        articleCount: null,
      },
      {
        id: "5",
        name: "Vestimenta Masculina",
        description: "Terno elegante, chal al cuello, mantón de seda, sombrero blanco (desde 1917) y pañuelo blanco.",
        icon: "User",
        href: "#danza",
        color: "amber",
        articleCount: null,
      },
      {
        id: "6",
        name: "El Carnaval",
        description: "La pandilla nació en las fiestas de carnaval, desde el miércoles de ceniza hasta los paseos campestres.",
        icon: "PartyPopper",
        href: "#danza",
        color: "orange",
        articleCount: null,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TEAM → DIRECTIVA / INTEGRANTES DESTACADOS
  // ═══════════════════════════════════════════════════════════════════════════════
  team: {
    badge: "Nuestra Familia",
    title: "Directiva Lira Puno",
    subtitle: "Guardianes de la tradición pandillera",
    members: [
      {
        id: "1",
        name: "Presidente",
        role: "Dirección General",
        avatar: "/images/team/presidente.jpg",
        bio: "Responsable de preservar y difundir la tradición de Lira Puno",
        social: {
          email: "presidente@lirapuno.pe",
        },
      },
      {
        id: "2",
        name: "Director Musical",
        role: "Estudiantina",
        avatar: "/images/team/director-musical.jpg",
        bio: "Dirige el conjunto de cuerdas que da vida al huayño pandillero",
        social: {
          email: "musica@lirapuno.pe",
        },
      },
      {
        id: "3",
        name: "Bastonero Mayor",
        role: "Coreografía",
        avatar: "/images/team/bastonero.jpg",
        bio: "Guía las mudanzas y preserva la elegancia de cada paso",
        social: {
          email: "danza@lirapuno.pe",
        },
      },
      {
        id: "4",
        name: "Coordinadora",
        role: "Eventos y Difusión",
        avatar: "/images/team/coordinadora.jpg",
        bio: "Organiza presentaciones y promueve la pandilla en el Perú y el mundo",
        social: {
          email: "eventos@lirapuno.pe",
        },
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // NEWSLETTER → CONTACTO / ÚNETE
  // ═══════════════════════════════════════════════════════════════════════════════
  newsletter: {
    badge: "Únete a la Tradición",
    title: "Sé Parte de Lira Puno",
    subtitle: "¿Quieres bailar con nosotros? Déjanos tus datos y te contactaremos para las próximas convocatorias",
    placeholder: "tu@email.com",
    buttonText: "Quiero Participar",
    successMessage: "¡Gracias por tu interés! Te contactaremos pronto con información sobre nuestras convocatorias.",
    showContactForm: true,
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FOOTER
  // ═══════════════════════════════════════════════════════════════════════════════
  footer: {
    logo: {
      text: "Lira Puno",
      icon: "Music",
    },
    description: "Conjunto Pandillero Lira Puno. Desde 1926 preservando la Pandilla Puneña, Patrimonio Cultural de la Nación. Elegancia, tradición y el alma del carnaval puneño.",
    columns: [
      {
        title: "La Danza",
        links: [
          { text: "Historia", href: "#historia" },
          { text: "El Bastonero", href: "#danza" },
          { text: "La Estudiantina", href: "#danza" },
          { text: "Vestimenta", href: "#danza" },
        ],
      },
      {
        title: "Participa",
        links: [
          { text: "Únete", href: "#contacto" },
          { text: "Eventos", href: "#eventos" },
          { text: "Carnaval", href: "#eventos" },
          { text: "Galería", href: "#galeria" },
        ],
      },
      {
        title: "Contacto",
        links: [
          { text: "Facebook", href: "https://facebook.com/lirapuno", external: true },
          { text: "Instagram", href: "https://instagram.com/lirapuno", external: true },
          { text: "YouTube", href: "https://youtube.com/lirapuno", external: true },
          { text: "Email", href: "mailto:contacto@lirapuno.pe" },
        ],
      },
    ],
    social: {
      facebook: "https://facebook.com/lirapuno",
      instagram: "https://instagram.com/lirapuno",
      youtube: "https://youtube.com/lirapuno",
    },
    copyright: "© 2026 Conjunto Pandillero Lira Puno. Patrimonio Cultural de la Nación.",
    bottomLinks: [
      { text: "Puno, Perú", href: "#" },
      { text: "Desde 1926", href: "#historia" },
    ],
  },
};

export default landingConfig;
