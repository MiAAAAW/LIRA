/**
 * @fileoverview Admin Panel Constants & Module Configuration
 * @description Configuración centralizada para el panel administrativo de Pandilla Lira Puno
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN GLOBAL DEL ADMIN
// ═══════════════════════════════════════════════════════════════════════════════
export const ADMIN_CONFIG = {
  orgName: 'Lira Puno',
  orgFullName: 'Conjunto Pandillero Lira Puno',
  defaultEmail: 'admin@lirapuno.pe',
  panelTitle: 'Panel Admin',
};

export const ADMIN_ROUTES = {
  dashboard: '/admin',
  settings: '/admin/settings',
  profile: '/profile',
  logout: '/logout',
  landing: '/',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICONOS (lucide-react)
// ═══════════════════════════════════════════════════════════════════════════════
export const ICONS = {
  // Módulos
  ley24325: 'Scale',
  baseLegal: 'FileText',
  indecopi: 'Shield',
  estandartes: 'Flag',
  presidentes: 'Users',
  videos: 'Video',
  audios: 'Music',
  distinciones: 'Award',
  publicaciones: 'Newspaper',
  comunicados: 'Megaphone',
  // Miembros y Asistencia
  miembros: 'UserPlus',
  eventos: 'Calendar',
  sanciones: 'AlertTriangle',
  reportes: 'BarChart3',
  // UI
  dashboard: 'LayoutDashboard',
  settings: 'Settings',
  logout: 'LogOut',
  add: 'Plus',
  edit: 'Pencil',
  delete: 'Trash2',
  view: 'Eye',
  search: 'Search',
  filter: 'Filter',
  export: 'Download',
  import: 'Upload',
  refresh: 'RefreshCw',
  chevronRight: 'ChevronRight',
  chevronDown: 'ChevronDown',
};

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORÍAS DE MÓDULOS
// ═══════════════════════════════════════════════════════════════════════════════
export const MODULE_CATEGORIES = {
  legal: {
    id: 'legal',
    label: 'Marco Legal e Historia',
    description: 'Documentación legal, registros y patrimonio histórico',
    icon: 'Scale',
    color: 'blue',
  },
  multimedia: {
    id: 'multimedia',
    label: 'Multimedia y Comunicación',
    description: 'Videos, audios, publicaciones y comunicados oficiales',
    icon: 'PlayCircle',
    color: 'purple',
  },
  miembros: {
    id: 'miembros',
    label: 'Miembros y Asistencia',
    description: 'Registro de miembros, eventos, asistencia y sanciones',
    icon: 'UserPlus',
    color: 'teal',
  },
  landing: {
    id: 'landing',
    label: 'Landing Page',
    description: 'Configuración visual del landing público',
    icon: 'Layout',
    color: 'slate',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MÓDULOS DEL ADMIN
// ═══════════════════════════════════════════════════════════════════════════════
export const ADMIN_MODULES = [
  // ─────────────────────────────────────────────────────────────────────────────
  // GRUPO 1: Marco Legal e Historia (1-5)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'ley24325',
    slug: 'ley24325',
    label: 'Ley 24325',
    labelPlural: 'Ley 24325',
    description: 'Ley que declara la Pandilla Puneña como Patrimonio Cultural',
    icon: 'Scale',
    route: '/admin/ley24325',
    apiEndpoint: '/api/admin/ley24325',
    category: 'legal',
    order: 1,
    color: 'emerald',
    fields: ['titulo', 'numero_ley', 'fecha_promulgacion', 'descripcion', 'contenido', 'documento_pdf', 'imagen'],
  },
  {
    id: 'baseLegal',
    slug: 'base-legal',
    label: 'Base Legal',
    labelPlural: 'Documentos Legales',
    description: 'Resoluciones, decretos y normativas relacionadas',
    icon: 'FileText',
    route: '/admin/base-legal',
    apiEndpoint: '/api/admin/base-legal',
    category: 'legal',
    order: 2,
    color: 'blue',
    fields: ['titulo', 'tipo_documento', 'numero_documento', 'fecha_emision', 'entidad_emisora', 'descripcion', 'documento_pdf'],
  },
  {
    id: 'indecopi',
    slug: 'indecopi',
    label: 'INDECOPI',
    labelPlural: 'Registros INDECOPI',
    description: 'Marcas registradas y denominaciones de origen',
    icon: 'Shield',
    route: '/admin/indecopi',
    apiEndpoint: '/api/admin/indecopi',
    category: 'legal',
    order: 3,
    color: 'cyan',
    fields: ['titulo', 'numero_registro', 'tipo_registro', 'fecha_registro', 'estado', 'certificado_pdf', 'imagen'],
  },
  {
    id: 'estandartes',
    slug: 'estandartes',
    label: 'Estandarte',
    labelPlural: 'Estandartes',
    description: 'Estandartes históricos y conmemorativos del conjunto',
    icon: 'Flag',
    route: '/admin/estandartes',
    apiEndpoint: '/api/admin/estandartes',
    category: 'legal',
    order: 4,
    color: 'amber',
    fields: ['titulo', 'tipo', 'anio', 'autor', 'descripcion', 'historia', 'imagen_principal', 'galeria'],
  },
  {
    id: 'presidentes',
    slug: 'presidentes',
    label: 'Presidente',
    labelPlural: 'Presidentes',
    description: 'Galería de presidentes históricos y actuales',
    icon: 'Users',
    route: '/admin/presidentes',
    apiEndpoint: '/api/admin/presidentes',
    category: 'legal',
    order: 5,
    color: 'violet',
    fields: ['nombres', 'apellidos', 'foto', 'periodo_inicio', 'periodo_fin', 'es_actual', 'biografia', 'logros'],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GRUPO 2: Multimedia y Comunicación (6-10)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'videos',
    slug: 'videos',
    label: 'Video',
    labelPlural: 'Videos',
    description: 'Galería de videos de presentaciones y documentales',
    icon: 'Video',
    route: '/admin/videos',
    apiEndpoint: '/api/admin/videos',
    category: 'multimedia',
    order: 6,
    color: 'red',
    fields: ['titulo', 'descripcion', 'tipo_fuente', 'url_video', 'thumbnail', 'duracion', 'categoria'],
  },
  {
    id: 'audios',
    slug: 'audios',
    label: 'Audio',
    labelPlural: 'Audios',
    description: 'Música tradicional: marineras, huayños y pandillas',
    icon: 'Music',
    route: '/admin/audios',
    apiEndpoint: '/api/admin/audios',
    category: 'multimedia',
    order: 7,
    color: 'orange',
    fields: ['titulo', 'tipo', 'compositor', 'interprete', 'url_audio', 'tipo_fuente', 'letra', 'partitura_pdf'],
  },
  {
    id: 'distinciones',
    slug: 'distinciones',
    label: 'Distinción',
    labelPlural: 'Distinciones',
    description: 'Premios, reconocimientos y condecoraciones recibidas',
    icon: 'Award',
    route: '/admin/distinciones',
    apiEndpoint: '/api/admin/distinciones',
    category: 'multimedia',
    order: 8,
    color: 'yellow',
    fields: ['titulo', 'tipo', 'otorgante', 'fecha_otorgamiento', 'descripcion', 'imagen', 'documento_pdf'],
  },
  {
    id: 'publicaciones',
    slug: 'publicaciones',
    label: 'Publicación',
    labelPlural: 'Publicaciones',
    description: 'Libros, revistas e investigaciones sobre la pandilla',
    icon: 'Newspaper',
    route: '/admin/publicaciones',
    apiEndpoint: '/api/admin/publicaciones',
    category: 'multimedia',
    order: 9,
    color: 'indigo',
    fields: ['titulo', 'tipo', 'autor', 'editorial', 'anio_publicacion', 'descripcion', 'imagen_portada', 'documento_pdf'],
  },
  {
    id: 'comunicados',
    slug: 'comunicados',
    label: 'Comunicado',
    labelPlural: 'Comunicados',
    description: 'Notas de prensa, avisos y pronunciamientos oficiales',
    icon: 'Megaphone',
    route: '/admin/comunicados',
    apiEndpoint: '/api/admin/comunicados',
    category: 'multimedia',
    order: 10,
    color: 'pink',
    fields: ['titulo', 'tipo', 'numero', 'fecha', 'extracto', 'contenido', 'imagen', 'firmante'],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GRUPO 3: Miembros y Asistencia (11-14)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'miembros',
    slug: 'miembros',
    label: 'Miembro',
    labelPlural: 'Miembros',
    description: 'Registro de danzantes y directivos del conjunto',
    icon: 'UserPlus',
    route: '/admin/miembros',
    apiEndpoint: '/api/admin/miembros',
    category: 'miembros',
    order: 11,
    color: 'teal',
    fields: ['nombres', 'apellidos', 'dni', 'telefono', 'email', 'tipo', 'cargo', 'anio_ingreso', 'is_active', 'foto'],
  },
  {
    id: 'eventos',
    slug: 'eventos',
    label: 'Evento',
    labelPlural: 'Eventos',
    description: 'Ensayos, reuniones y presentaciones del conjunto',
    icon: 'Calendar',
    route: '/admin/eventos',
    apiEndpoint: '/api/admin/eventos',
    category: 'miembros',
    order: 12,
    color: 'sky',
    fields: ['titulo', 'tipo', 'fecha', 'hora_inicio', 'hora_fin', 'ubicacion', 'descripcion'],
  },
  {
    id: 'sanciones',
    slug: 'sanciones',
    label: 'Sanción',
    labelPlural: 'Sanciones',
    description: 'Multas, amonestaciones y suspensiones',
    icon: 'AlertTriangle',
    route: '/admin/sanciones',
    apiEndpoint: '/api/admin/sanciones',
    category: 'miembros',
    order: 13,
    color: 'rose',
    fields: ['miembro_id', 'tipo', 'monto', 'motivo', 'estado', 'fecha'],
  },
  {
    id: 'reportes',
    slug: 'reportes-asistencia',
    label: 'Reporte',
    labelPlural: 'Reportes',
    description: 'Reportes de asistencia y estadísticas',
    icon: 'BarChart3',
    route: '/admin/reportes/asistencia',
    apiEndpoint: null,
    category: 'miembros',
    order: 14,
    color: 'indigo',
    fields: [],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // GRUPO 4: Landing Page (15+)
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'heroConfig',
    slug: 'hero-config',
    label: 'Hero',
    labelPlural: 'Hero Config',
    description: 'Video, textos y configuración del hero principal',
    icon: 'Monitor',
    route: '/admin/hero-config',
    apiEndpoint: '/api/admin/hero-config',
    category: 'landing',
    order: 15,
    color: 'slate',
    fields: ['titulo_principal', 'titulo_highlight', 'subtitulo', 'video_url', 'stats'],
  },
  {
    id: 'musicConfig',
    slug: 'music-config',
    label: 'Música de Fondo',
    labelPlural: 'Música de Fondo',
    description: 'Audio ambiental para el landing page',
    icon: 'Music2',
    route: '/admin/music-config',
    apiEndpoint: null,
    category: 'landing',
    order: 16,
    color: 'rose',
    fields: ['titulo', 'descripcion', 'audio_url', 'volume', 'loop'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtener módulo por ID
 */
export const getModuleById = (id) => ADMIN_MODULES.find((m) => m.id === id);

/**
 * Obtener módulo por slug
 */
export const getModuleBySlug = (slug) => ADMIN_MODULES.find((m) => m.slug === slug);

/**
 * Obtener módulos por categoría
 */
export const getModulesByCategory = (categoryId) =>
  ADMIN_MODULES.filter((m) => m.category === categoryId).sort((a, b) => a.order - b.order);

/**
 * Módulos del grupo Marco Legal (1-5)
 */
export const LEGAL_MODULES = getModulesByCategory('legal');

/**
 * Módulos del grupo Multimedia (6-10)
 */
export const MULTIMEDIA_MODULES = getModulesByCategory('multimedia');

/**
 * Módulos del grupo Miembros (11-14)
 */
export const MIEMBROS_MODULES = getModulesByCategory('miembros');

/**
 * Módulos del grupo Landing (15+)
 */
export const LANDING_MODULES = getModulesByCategory('landing');

// ═══════════════════════════════════════════════════════════════════════════════
// NAVEGACIÓN ADMIN SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════
export const ADMIN_NAVIGATION = {
  main: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      route: '/admin',
    },
  ],
  groups: [
    {
      id: 'landing',
      label: 'Landing Page',
      icon: 'Layout',
      items: LANDING_MODULES.map((m) => ({
        id: m.id,
        label: m.labelPlural,
        icon: m.icon,
        route: m.route,
      })),
    },
    {
      id: 'legal',
      label: 'Marco Legal',
      icon: 'Scale',
      items: LEGAL_MODULES.map((m) => ({
        id: m.id,
        label: m.labelPlural,
        icon: m.icon,
        route: m.route,
      })),
    },
    {
      id: 'multimedia',
      label: 'Multimedia',
      icon: 'PlayCircle',
      items: MULTIMEDIA_MODULES.map((m) => ({
        id: m.id,
        label: m.labelPlural,
        icon: m.icon,
        route: m.route,
      })),
    },
    {
      id: 'miembros',
      label: 'Miembros',
      icon: 'UserPlus',
      items: MIEMBROS_MODULES.map((m) => ({
        id: m.id,
        label: m.labelPlural,
        icon: m.icon,
        route: m.route,
      })),
    },
  ],
  footer: [
    {
      id: 'settings',
      label: 'Configuración',
      icon: 'Settings',
      route: '/admin/settings',
    },
    {
      id: 'landing',
      label: 'Ver Landing',
      icon: 'ExternalLink',
      route: '/',
      external: true,
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS DE EVENTO
// ═══════════════════════════════════════════════════════════════════════════════
export const EVENTO_TIPO_LABELS = {
  ensayo: 'Ensayo',
  reunion: 'Reunión',
  presentacion: 'Presentación',
  otro: 'Otro',
};

export const EVENTO_TIPO_COLORS = {
  ensayo: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  reunion: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  presentacion: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  otro: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ESTADOS Y OPCIONES COMUNES
// ═══════════════════════════════════════════════════════════════════════════════
export const PUBLISH_STATUS = {
  published: { label: 'Publicado', color: 'green', icon: 'CheckCircle' },
  draft: { label: 'Borrador', color: 'gray', icon: 'FileEdit' },
};

export const COMMON_ACTIONS = {
  create: { label: 'Crear', icon: 'Plus', variant: 'default' },
  edit: { label: 'Editar', icon: 'Pencil', variant: 'outline' },
  delete: { label: 'Eliminar', icon: 'Trash2', variant: 'destructive' },
  view: { label: 'Ver', icon: 'Eye', variant: 'ghost' },
  publish: { label: 'Publicar', icon: 'Globe', variant: 'default' },
  unpublish: { label: 'Despublicar', icon: 'EyeOff', variant: 'outline' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE TABLAS
// ═══════════════════════════════════════════════════════════════════════════════
export const TABLE_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  defaultSort: { field: 'created_at', direction: 'desc' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MENSAJES UI
// ═══════════════════════════════════════════════════════════════════════════════
export const UI_MESSAGES = {
  confirmDelete: '¿Estás seguro de eliminar este registro? Esta acción no se puede deshacer.',
  deleteSuccess: 'Registro eliminado correctamente',
  deleteError: 'Error al eliminar el registro',
  saveSuccess: 'Cambios guardados correctamente',
  saveError: 'Error al guardar los cambios',
  loadError: 'Error al cargar los datos',
  noResults: 'No se encontraron resultados',
  loading: 'Cargando...',
};

export default {
  ICONS,
  MODULE_CATEGORIES,
  ADMIN_MODULES,
  ADMIN_NAVIGATION,
  EVENTO_TIPO_LABELS,
  EVENTO_TIPO_COLORS,
  PUBLISH_STATUS,
  COMMON_ACTIONS,
  TABLE_CONFIG,
  UI_MESSAGES,
  getModuleById,
  getModuleBySlug,
  getModulesByCategory,
  LEGAL_MODULES,
  MULTIMEDIA_MODULES,
  MIEMBROS_MODULES,
  LANDING_MODULES,
};
