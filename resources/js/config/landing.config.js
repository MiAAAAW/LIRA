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
  // NAVIGATION - Links a secciones reales del landing
  // ═══════════════════════════════════════════════════════════════════════════════
  navigation: {
    logo: {
      text: "Lira Puno",
      icon: "Music",
      href: "/",
    },
    items: [
      { label: "Inicio", href: "#" },
      { label: "Marco Legal", href: "#marco-legal" },
      { label: "Normativas", href: "#normativas" },
      { label: "Registros", href: "#registros" },
      { label: "Historia", href: "#historia" },
      { label: "Liderazgo", href: "#liderazgo" },
    ],
    cta: {
      text: "Admin",
      href: "/admin",
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // HERO SECTION
  // ═══════════════════════════════════════════════════════════════════════════════
  hero: {
    badge: null,
    title: {
      main: "Conjunto Pandillero",
      highlight: "Lira Puno",
      suffix: "",
      break: true,
    },
    subtitle: "ALMA MATER DE LA PANDILLA PUNEÑA",
    years: "1926 - 2026",
    description: null,
    cta: null,
    image: {
      src: "/images/hero-pandilla.jpg",
      alt: "Conjunto Pandillero Lira Puno",
    },
    stats: null,
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TEAM → PRESIDENTES (datos vienen de BD: Presidentes)
  // ═══════════════════════════════════════════════════════════════════════════════
  team: {
    badge: "Nuestra Familia",
    title: "Presidentes Lira Puno",
    subtitle: "Guardianes de la tradición pandillera a través de la historia",
    // members: [] ← vienen de LandingController (Presidentes)
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // COLUMNS LAYOUT - Configuración para el layout de 2 columnas paralelas
  // ═══════════════════════════════════════════════════════════════════════════════
  columns: {
    institutional: {
      title: "Marco Institucional",
      icon: "Scale",
      description: "Documentos legales, historia y estructura organizacional",
      sections: [
        { id: "ley24325", title: "Ley 24325", icon: "Scale", description: "Patrimonio Cultural de la Nación" },
        { id: "baseLegal", title: "Base Legal", icon: "FileText", description: "Normativas y documentos" },
        { id: "indecopi", title: "INDECOPI", icon: "Shield", description: "Registros de marca" },
        { id: "estandartes", title: "Estandartes", icon: "Flag", description: "Símbolos institucionales" },
        { id: "presidentes", title: "Presidentes", icon: "Users", description: "Líderes históricos" },
      ],
    },
    content: {
      title: "Contenido",
      icon: "Play",
      description: "Multimedia, publicaciones y comunicados oficiales",
      sections: [
        { id: "videos", title: "Videos", icon: "Video", description: "Archivo audiovisual" },
        { id: "audios", title: "Audios", icon: "Music", description: "Música y grabaciones" },
        { id: "distinciones", title: "Distinciones", icon: "Award", description: "Reconocimientos" },
        { id: "publicaciones", title: "Publicaciones", icon: "Newspaper", description: "Libros y revistas" },
        { id: "comunicados", title: "Comunicados", icon: "Megaphone", description: "Anuncios oficiales" },
      ],
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FOOTER - Simplificado, solo navegación a secciones reales
  // ═══════════════════════════════════════════════════════════════════════════════
  footer: {
    logo: {
      text: "Lira Puno",
      icon: "Music",
    },
    description: "Conjunto Pandillero Lira Puno. Patrimonio Cultural de la Nación.",
    columns: [
      {
        title: "Institucional",
        links: [
          { text: "Ley 24325", href: "#contenido" },
          { text: "Base Legal", href: "#contenido" },
          { text: "INDECOPI", href: "#contenido" },
          { text: "Estandartes", href: "#contenido" },
          { text: "Presidentes", href: "#contenido" },
        ],
      },
      {
        title: "Contenido",
        links: [
          { text: "Videos", href: "#contenido" },
          { text: "Audios", href: "#contenido" },
          { text: "Publicaciones", href: "#contenido" },
          { text: "Comunicados", href: "#contenido" },
          { text: "Distinciones", href: "#contenido" },
        ],
      },
      {
        title: "Administración",
        links: [
          { text: "Panel Admin", href: "/admin" },
        ],
      },
    ],
    social: {},
    copyright: "© 2026 Conjunto Pandillero Lira Puno.",
    bottomLinks: [],
  },
};

export default landingConfig;
