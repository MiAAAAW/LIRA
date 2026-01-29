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
        'articulo' => 'Artículo',
        'investigacion' => 'Investigación',
        'tesis' => 'Tesis',
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
        'cloudinary' => 'Cloudinary',
        'local' => 'Archivo Local',
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración de Uploads
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
    | Paginación
    |--------------------------------------------------------------------------
    */

    'pagination' => [
        'admin' => 15,
        'landing' => 6,
        'api' => 20,
    ],

];
