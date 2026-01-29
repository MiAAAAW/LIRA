<?php

namespace Database\Seeders;

use App\Models\Comunicado;
use App\Models\Presidente;
use App\Models\Publicacion;
use App\Models\Video;
use App\Models\Audio;
use App\Models\Distincion;
use App\Models\Estandarte;
use App\Models\Ley24325;
use App\Models\BaseLegal;
use App\Models\RegistroIndecopi;
use Illuminate\Database\Seeder;

class LandingContentSeeder extends Seeder
{
    /**
     * Seed the application's database with example content.
     * This content will replace the hardcoded fallback on the landing page.
     */
    public function run(): void
    {
        $this->command->info('Seeding landing content...');

        // =====================================================
        // LEY 24325 - Marco Legal Principal
        // =====================================================
        Ley24325::create([
            'titulo' => 'Ley 24325 - Pandilla Puneña Patrimonio Cultural',
            'numero_ley' => '24325',
            'fecha_promulgacion' => '1985-11-06',
            'descripcion' => 'Declara Patrimonio Cultural de la Nación a la Pandilla Puneña, reconociendo su valor artístico, histórico y cultural.',
            'contenido' => 'Artículo 1.- Declárase Patrimonio Cultural de la Nación a la danza denominada "Pandilla Puneña"...',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        // =====================================================
        // BASE LEGAL
        // =====================================================
        BaseLegal::create([
            'titulo' => 'Resolución Viceministerial Nº 046-2012-VMPCIC-MC',
            'tipo_documento' => 'resolucion',
            'numero_documento' => '046-2012',
            'fecha_emision' => '2012-08-20',
            'entidad_emisora' => 'Ministerio de Cultura',
            'descripcion' => 'Declara a la Pandilla Puneña como Patrimonio Cultural de la Nación.',
            'is_published' => true,
            'orden' => 1,
        ]);

        BaseLegal::create([
            'titulo' => 'Ordenanza Regional Nº 012-2015',
            'tipo_documento' => 'ordenanza',
            'numero_documento' => '012-2015',
            'fecha_emision' => '2015-02-14',
            'entidad_emisora' => 'Gobierno Regional de Puno',
            'descripcion' => 'Establece el Día de la Pandilla Puneña.',
            'is_published' => true,
            'orden' => 2,
        ]);

        // =====================================================
        // REGISTRO INDECOPI
        // =====================================================
        RegistroIndecopi::create([
            'titulo' => 'Denominación de Origen - Pandilla Puneña',
            'numero_registro' => 'DO-2018-00234',
            'fecha_registro' => '2018-05-15',
            'tipo_registro' => 'denominacion_origen',
            'estado' => 'vigente',
            'descripcion' => 'Registro de denominación de origen para proteger la autenticidad de la Pandilla Puneña. Titular: Asociación de Conjuntos Pandilleros de Puno.',
            'is_published' => true,
            'orden' => 1,
        ]);

        // =====================================================
        // PRESIDENTES
        // =====================================================
        Presidente::create([
            'nombres' => 'Juan Carlos',
            'apellidos' => 'Mamani Quispe',
            'foto' => null,
            'periodo_inicio' => '2022',
            'periodo_fin' => null,
            'es_actual' => true,
            'profesion' => 'Ingeniero Civil',
            'biografia' => 'Actual presidente del Conjunto Pandillero Lira Puno. Lidera la institución desde 2022, promoviendo la difusión de la pandilla puneña a nivel nacional e internacional.',
            'email' => 'presidente@lirapuno.pe',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        Presidente::create([
            'nombres' => 'María Elena',
            'apellidos' => 'Flores Condori',
            'foto' => null,
            'periodo_inicio' => '2018',
            'periodo_fin' => '2022',
            'es_actual' => false,
            'profesion' => 'Docente Universitaria',
            'biografia' => 'Ex presidenta que logró importantes reconocimientos para la institución durante su gestión.',
            'email' => null,
            'is_published' => true,
            'orden' => 2,
        ]);

        Presidente::create([
            'nombres' => 'Roberto',
            'apellidos' => 'Choque Apaza',
            'foto' => null,
            'periodo_inicio' => '2014',
            'periodo_fin' => '2018',
            'es_actual' => false,
            'profesion' => 'Abogado',
            'biografia' => 'Impulsó la campaña para declarar a la pandilla puneña patrimonio de la humanidad.',
            'is_published' => true,
            'orden' => 3,
        ]);

        Presidente::create([
            'nombres' => 'Ana Lucía',
            'apellidos' => 'Pari Huanca',
            'foto' => null,
            'periodo_inicio' => '2010',
            'periodo_fin' => '2014',
            'es_actual' => false,
            'profesion' => 'Contadora',
            'biografia' => 'Primera mujer en presidir el conjunto, modernizó la gestión institucional.',
            'is_published' => true,
            'orden' => 4,
        ]);

        // =====================================================
        // COMUNICADOS (Noticias)
        // =====================================================
        Comunicado::create([
            'titulo' => 'Lira Puno celebra 98 años de fundación',
            'tipo' => 'comunicado',
            'numero' => '001-2024',
            'fecha' => '2024-01-15',
            'extracto' => 'El Conjunto Pandillero Lira Puno celebra sus 98 años de fundación con una serie de actividades culturales que incluyen presentaciones, exposiciones y un gran pasacalle.',
            'contenido' => 'Con gran orgullo, el Conjunto Pandillero Lira Puno conmemora sus 98 años de vida institucional...',
            'firmante' => 'Presidencia Lira Puno',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        Comunicado::create([
            'titulo' => 'Convocatoria Carnaval 2024',
            'tipo' => 'convocatoria',
            'fecha' => '2024-02-01',
            'extracto' => 'Se convoca a todos los socios y simpatizantes a participar en las actividades del Carnaval 2024.',
            'contenido' => 'Se convoca a todos los socios y simpatizantes a participar en las actividades del Carnaval 2024. La pandilla saldrá el sábado de carnaval desde la Plaza de Armas. Los ensayos se realizarán los días jueves y viernes previos. Se ruega puntualidad y vestimenta completa.',
            'firmante' => 'Comisión de Actividades',
            'is_published' => true,
            'orden' => 2,
        ]);

        Comunicado::create([
            'titulo' => 'Lira Puno en la Candelaria 2024',
            'tipo' => 'nota_prensa',
            'fecha' => '2024-02-10',
            'extracto' => 'Nuestra institución participó exitosamente en la Festividad de la Virgen de la Candelaria.',
            'contenido' => 'Nuestra institución participó exitosamente en la Festividad de la Virgen de la Candelaria, declarada Patrimonio de la Humanidad por UNESCO. La presentación fue aclamada por el público asistente y recibió reconocimiento de las autoridades locales.',
            'firmante' => 'Oficina de Comunicaciones',
            'is_published' => true,
            'orden' => 3,
        ]);

        // =====================================================
        // PUBLICACIONES
        // =====================================================
        Publicacion::create([
            'titulo' => 'Historia de la Pandilla Puneña: Orígenes y Evolución',
            'tipo' => 'libro',
            'autor' => 'Dr. José María Arguedas Altamirano',
            'editorial' => 'Editorial San Marcos',
            'anio_publicacion' => '2020',
            'descripcion' => 'Investigación exhaustiva sobre los orígenes de la pandilla puneña desde 1907 hasta la actualidad.',
            'imagen_portada' => '/images/publicaciones/historia-pandilla.jpg',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        Publicacion::create([
            'titulo' => 'La Estudiantina Puneña: Música y Tradición',
            'tipo' => 'libro',
            'autor' => 'Lic. Carmen Rosa Tejada',
            'anio_publicacion' => '2018',
            'descripcion' => 'Análisis musicológico del huayño pandillero y los instrumentos tradicionales de la estudiantina.',
            'imagen_portada' => '/images/publicaciones/estudiantina.jpg',
            'is_published' => true,
            'orden' => 2,
        ]);

        // =====================================================
        // VIDEOS
        // =====================================================
        Video::create([
            'titulo' => 'Lira Puno - Carnaval 2024',
            'descripcion' => 'Presentación del Conjunto Pandillero Lira Puno durante el Carnaval de Puno 2024.',
            'tipo_fuente' => 'youtube',
            'video_id' => 'dQw4w9WgXcQ', // Placeholder
            'url_video' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'duracion' => '15:30',
            'anio' => '2024',
            'categoria' => 'presentacion',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        Video::create([
            'titulo' => 'Documental: 90 Años de Lira Puno',
            'descripcion' => 'Documental conmemorativo por los 90 años de fundación de la institución.',
            'tipo_fuente' => 'youtube',
            'video_id' => 'dQw4w9WgXcQ',
            'url_video' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'duracion' => '45:00',
            'anio' => '2016',
            'categoria' => 'documental',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 2,
        ]);

        // =====================================================
        // AUDIOS
        // =====================================================
        Audio::create([
            'titulo' => 'Huayño Pandillero - Lira Puno',
            'descripcion' => 'Grabación original de la estudiantina Lira Puno interpretando el tradicional huayño pandillero.',
            'tipo' => 'pandilla',
            'compositor' => 'Tradicional',
            'interprete' => 'Estudiantina Lira Puno',
            'duracion' => '4:30',
            'url_audio' => 'https://soundcloud.com/lirapuno/huayno-pandillero',
            'tipo_fuente' => 'soundcloud',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        // =====================================================
        // DISTINCIONES
        // =====================================================
        Distincion::create([
            'titulo' => 'Patrimonio Cultural de la Nación',
            'tipo' => 'reconocimiento',
            'otorgante' => 'Ministerio de Cultura del Perú',
            'fecha_otorgamiento' => '2012-08-20',
            'descripcion' => 'Máximo reconocimiento nacional a la Pandilla Puneña por su valor cultural e histórico.',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        Distincion::create([
            'titulo' => 'Medalla de Honor de la Ciudad de Puno',
            'tipo' => 'medalla',
            'otorgante' => 'Municipalidad Provincial de Puno',
            'fecha_otorgamiento' => '2016-11-04',
            'descripcion' => 'Reconocimiento por los 90 años de vida institucional.',
            'is_published' => true,
            'orden' => 2,
        ]);

        // =====================================================
        // ESTANDARTES
        // =====================================================
        Estandarte::create([
            'titulo' => 'Estandarte Histórico 1926',
            'tipo' => 'historico',
            'descripcion' => 'Primer estandarte del Conjunto Pandillero Lira Puno, bordado a mano con hilos de oro y plata.',
            'anio' => '1926',
            'materiales' => 'Terciopelo, hilos de oro y plata',
            'is_published' => true,
            'is_featured' => true,
            'orden' => 1,
        ]);

        Estandarte::create([
            'titulo' => 'Estandarte del Centenario',
            'tipo' => 'conmemorativo',
            'descripcion' => 'Estandarte conmemorativo por los 100 años de fundación institucional.',
            'anio' => '2026',
            'is_published' => true,
            'orden' => 2,
        ]);

        $this->command->info('Landing content seeded successfully!');
        $this->command->info('');
        $this->command->info('Summary:');
        $this->command->info('- Ley 24325: ' . Ley24325::count());
        $this->command->info('- Base Legal: ' . BaseLegal::count());
        $this->command->info('- INDECOPI: ' . RegistroIndecopi::count());
        $this->command->info('- Presidentes: ' . Presidente::count());
        $this->command->info('- Comunicados: ' . Comunicado::count());
        $this->command->info('- Publicaciones: ' . Publicacion::count());
        $this->command->info('- Videos: ' . Video::count());
        $this->command->info('- Audios: ' . Audio::count());
        $this->command->info('- Distinciones: ' . Distincion::count());
        $this->command->info('- Estandartes: ' . Estandarte::count());
    }
}
