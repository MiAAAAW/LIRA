<?php

/**
 * Configuración de Pandilla Lira Puno
 *
 * Centraliza todas las opciones del conjunto
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Información del Conjunto
    |--------------------------------------------------------------------------
    */

    'nombre' => 'Conjunto Pandillero Lira Puno',
    'nombre_corto' => 'Lira Puno',
    'fundacion' => 1926,
    'patrimonio_anio' => 2012,
    'resolucion_patrimonio' => 'R.V.M. Nº 046-2012-VMPCIC-MC',
    'descripcion' => 'Patrimonio Cultural de la Nación. Tradición, elegancia y pasión por la Pandilla Puneña.',

    /*
    |--------------------------------------------------------------------------
    | Contacto
    |--------------------------------------------------------------------------
    */

    'contacto' => [
        'email' => env('PANDILLA_EMAIL', 'contacto@lirapuno.pe'),
        'telefono' => env('PANDILLA_TELEFONO', '+51 951 000 000'),
        'direccion' => 'Jr. Lima 123, Puno, Perú',
        'ciudad' => 'Puno',
        'departamento' => 'Puno',
        'pais' => 'Perú',
    ],

    /*
    |--------------------------------------------------------------------------
    | Redes Sociales
    |--------------------------------------------------------------------------
    */

    'redes_sociales' => [
        'facebook' => env('PANDILLA_FACEBOOK', 'https://facebook.com/lirapuno'),
        'instagram' => env('PANDILLA_INSTAGRAM', 'https://instagram.com/lirapuno'),
        'youtube' => env('PANDILLA_YOUTUBE', 'https://youtube.com/lirapuno'),
        'tiktok' => env('PANDILLA_TIKTOK', null),
        'twitter' => env('PANDILLA_TWITTER', null),
    ],

    /*
    |--------------------------------------------------------------------------
    | Módulos del Admin
    |--------------------------------------------------------------------------
    */

    'modulos' => [
        'ley24325' => [
            'nombre' => 'Ley 24325',
            'descripcion' => 'Ley que declara la Pandilla Puneña como Patrimonio Cultural',
            'icono' => 'scale',
            'habilitado' => true,
        ],
        'base_legal' => [
            'nombre' => 'Base Legal',
            'descripcion' => 'Resoluciones, decretos y normativas relacionadas',
            'icono' => 'file-text',
            'habilitado' => true,
        ],
        'indecopi' => [
            'nombre' => 'INDECOPI',
            'descripcion' => 'Marcas registradas y denominaciones de origen',
            'icono' => 'shield',
            'habilitado' => true,
        ],
        'estandartes' => [
            'nombre' => 'Estandartes',
            'descripcion' => 'Estandartes históricos y conmemorativos',
            'icono' => 'flag',
            'habilitado' => true,
        ],
        'presidentes' => [
            'nombre' => 'Presidentes',
            'descripcion' => 'Galería de presidentes históricos y actuales',
            'icono' => 'users',
            'habilitado' => true,
        ],
        'videos' => [
            'nombre' => 'Videos',
            'descripcion' => 'Galería de videos y documentales',
            'icono' => 'video',
            'habilitado' => true,
        ],
        'audios' => [
            'nombre' => 'Audios',
            'descripcion' => 'Música tradicional del conjunto',
            'icono' => 'music',
            'habilitado' => true,
        ],
        'distinciones' => [
            'nombre' => 'Distinciones',
            'descripcion' => 'Premios y reconocimientos recibidos',
            'icono' => 'award',
            'habilitado' => true,
        ],
        'publicaciones' => [
            'nombre' => 'Publicaciones',
            'descripcion' => 'Libros, revistas e investigaciones',
            'icono' => 'newspaper',
            'habilitado' => true,
        ],
        'comunicados' => [
            'nombre' => 'Comunicados',
            'descripcion' => 'Notas de prensa y avisos oficiales',
            'icono' => 'megaphone',
            'habilitado' => true,
        ],
        'miembros' => [
            'nombre' => 'Miembros',
            'descripcion' => 'Registro de danzantes y directivos del conjunto',
            'icono' => 'user-plus',
            'habilitado' => true,
        ],
        'eventos' => [
            'nombre' => 'Eventos',
            'descripcion' => 'Ensayos, reuniones y presentaciones',
            'icono' => 'calendar',
            'habilitado' => true,
        ],
        'sanciones' => [
            'nombre' => 'Sanciones',
            'descripcion' => 'Multas, amonestaciones y suspensiones',
            'icono' => 'alert-triangle',
            'habilitado' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Miembro
    |--------------------------------------------------------------------------
    */

    'tipos_miembro' => [
        'danzante' => 'Danzante',
        'directivo' => 'Directivo',
    ],

    'cargos_directivo' => [
        'presidente' => 'Presidente',
        'vicepresidente' => 'Vicepresidente',
        'secretario' => 'Secretario',
        'tesorero' => 'Tesorero',
        'fiscal' => 'Fiscal',
        'vocal' => 'Vocal',
        'delegado' => 'Delegado',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Evento
    |--------------------------------------------------------------------------
    */

    'tipos_evento' => [
        'ensayo' => 'Ensayo',
        'reunion' => 'Reunión',
        'presentacion' => 'Presentación',
        'otro' => 'Otro',
    ],

    /*
    |--------------------------------------------------------------------------
    | Estados de Asistencia
    |--------------------------------------------------------------------------
    */

    'estados_asistencia' => [
        'presente' => 'Presente',
        'ausente' => 'Ausente',
        'tardanza' => 'Tardanza',
        'justificado' => 'Justificado',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Sanción
    |--------------------------------------------------------------------------
    */

    'tipos_sancion' => [
        'multa' => 'Multa',
        'amonestacion' => 'Amonestación',
        'suspension' => 'Suspensión',
    ],

    'estados_sancion' => [
        'pendiente' => 'Pendiente',
        'pagado' => 'Pagado',
        'condonado' => 'Condonado',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Documentos Legales
    |--------------------------------------------------------------------------
    */

    'tipos_documento_legal' => [
        'ley' => 'Ley',
        'decreto' => 'Decreto',
        'resolucion' => 'Resolución',
        'ordenanza' => 'Ordenanza',
        'directiva' => 'Directiva',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Registro INDECOPI
    |--------------------------------------------------------------------------
    */

    'tipos_registro_indecopi' => [
        'marca' => 'Marca',
        'denominacion_origen' => 'Denominación de Origen',
        'marca_colectiva' => 'Marca Colectiva',
        'nombre_comercial' => 'Nombre Comercial',
    ],

    /*
    |--------------------------------------------------------------------------
    | Estados de Registro INDECOPI
    |--------------------------------------------------------------------------
    */

    'estados_indecopi' => [
        'vigente' => 'Vigente',
        'en_tramite' => 'En Trámite',
        'vencido' => 'Vencido',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Estandarte
    |--------------------------------------------------------------------------
    */

    'tipos_estandarte' => [
        'principal' => 'Principal',
        'historico' => 'Histórico',
        'conmemorativo' => 'Conmemorativo',
        'juvenil' => 'Juvenil',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Video
    |--------------------------------------------------------------------------
    */

    'categorias_video' => [
        'presentacion' => 'Presentación',
        'documental' => 'Documental',
        'entrevista' => 'Entrevista',
        'ensayo' => 'Ensayo',
        'tutorial' => 'Tutorial',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Audio
    |--------------------------------------------------------------------------
    */

    'tipos_audio' => [
        'marinera' => 'Marinera',
        'huayno' => 'Huayño',
        'pandilla' => 'Pandilla',
        'sikuri' => 'Sikuri',
        'morenada' => 'Morenada',
        'diablada' => 'Diablada',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Distinción
    |--------------------------------------------------------------------------
    */

    'tipos_distincion' => [
        'reconocimiento' => 'Reconocimiento',
        'premio' => 'Premio',
        'medalla' => 'Medalla',
        'diploma' => 'Diploma',
        'condecoracion' => 'Condecoración',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Publicación
    |--------------------------------------------------------------------------
    */

    'tipos_publicacion' => [
        'libro' => 'Libro',
        'revista' => 'Revista',
        'articulo' => 'Articulo',
        'investigacion' => 'Investigacion',
        'tesis' => 'Tesis',
        'otro' => 'Otro',
    ],

    /*
    |--------------------------------------------------------------------------
    | Tipos de Comunicado
    |--------------------------------------------------------------------------
    */

    'tipos_comunicado' => [
        'comunicado' => 'Comunicado',
        'nota_prensa' => 'Nota de Prensa',
        'aviso' => 'Aviso',
        'convocatoria' => 'Convocatoria',
        'pronunciamiento' => 'Pronunciamiento',
    ],

    /*
    |--------------------------------------------------------------------------
    | Fuentes de Video/Audio
    |--------------------------------------------------------------------------
    */

    'fuentes_media' => [
        'youtube' => 'YouTube',
        'vimeo' => 'Vimeo',
        'soundcloud' => 'SoundCloud',
        'spotify' => 'Spotify',
        'cloudflare' => 'Cloudflare R2 (CDN)',
        'cloudinary' => 'Cloudinary',
        'local' => 'Archivo Local',
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración de Uploads Locales
    |--------------------------------------------------------------------------
    */

    'uploads' => [
        'max_file_size' => 10 * 1024 * 1024, // 10MB
        'allowed_images' => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        'allowed_documents' => ['pdf', 'doc', 'docx'],
        'allowed_audio' => ['mp3', 'wav', 'ogg'],
        'allowed_video' => ['mp4', 'webm', 'mov'],
        'disk' => 'public',
        'paths' => [
            'images' => 'pandilla/images',
            'documents' => 'pandilla/documents',
            'audio' => 'pandilla/audio',
            'video' => 'pandilla/video',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración de Direct Upload (Cloudflare R2)
    |--------------------------------------------------------------------------
    |
    | Límites y tipos permitidos para uploads directos al CDN.
    | Estos valores se usan tanto en backend como frontend.
    |
    */

    'direct_upload' => [
        'presigned_url_expiry' => 60, // minutos

        'videos' => [
            'max_size' => 5 * 1024 * 1024 * 1024, // 5GB
            'mime_types' => [
                'video/mp4',
                'video/webm',
                'video/quicktime',
                'video/x-msvideo',
            ],
        ],

        'audios' => [
            'max_size' => 500 * 1024 * 1024, // 500MB
            'mime_types' => [
                'audio/mpeg',
                'audio/wav',
                'audio/ogg',
                'audio/mp4',
                'audio/x-m4a',
            ],
        ],

        'thumbnails' => [
            'max_size' => 10 * 1024 * 1024, // 10MB
            'mime_types' => [
                'image/jpeg',
                'image/png',
                'image/webp',
            ],
        ],

        'documents' => [
            'max_size' => 50 * 1024 * 1024, // 50MB
            'mime_types' => [
                'application/pdf',
            ],
        ],

        'hero' => [
            'max_size' => 5 * 1024 * 1024 * 1024, // 5GB (videos grandes)
            'mime_types' => [
                'video/mp4',
                'video/webm',
                'video/quicktime',
                'image/jpeg',
                'image/png',
                'image/webp',
            ],
        ],

        'music' => [
            'max_size' => 500 * 1024 * 1024, // 500MB
            'mime_types' => [
                'audio/mpeg',
                'audio/wav',
                'audio/ogg',
                'audio/mp4',
                'audio/x-m4a',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Procesamiento de Imágenes
    |--------------------------------------------------------------------------
    |
    | Configuración de tamaños y calidad para cada tipo de imagen.
    | Cada tipo define: original (resize), thumbnail, y calidad JPEG.
    |
    */

    'image_sizes' => [
        'estandartes' => [
            'original' => ['width' => 800, 'height' => 1067],
            'thumbnail' => ['width' => 300, 'height' => 400],
            'quality' => 85,
            'aspect' => '3:4', // vertical
        ],
        'presidentes' => [
            'original' => ['width' => 500, 'height' => 500],
            'thumbnail' => ['width' => 150, 'height' => 150],
            'quality' => 85,
            'aspect' => '1:1', // cuadrado
        ],
        'miembros' => [
            'original' => ['width' => 400, 'height' => 400],
            'thumbnail' => ['width' => 100, 'height' => 100],
            'quality' => 85,
            'aspect' => '1:1', // cuadrado
        ],
        'publicaciones' => [
            'original' => ['width' => 600, 'height' => 900],
            'thumbnail' => ['width' => 200, 'height' => 300],
            'quality' => 85,
            'aspect' => '2:3', // portada
        ],
        'distinciones' => [
            'original' => ['width' => 800, 'height' => 600],
            'thumbnail' => ['width' => 300, 'height' => 225],
            'quality' => 85,
            'aspect' => 'flexible', // mantiene aspecto original
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración WebP
    |--------------------------------------------------------------------------
    */

    'webp' => [
        'enabled' => true,
        'quality' => 80,
    ],

    /*
    |--------------------------------------------------------------------------
    | Paginación
    |--------------------------------------------------------------------------
    */

    'pagination' => [
        'admin' => 15,
        'landing' => 6,
        'api' => 20,
    ],

];
