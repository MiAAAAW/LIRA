<?php

namespace Database\Seeders;

use App\Models\Presidente;
use Illuminate\Database\Seeder;

class PresidentesSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Seeding presidentes reales...');

        // Limpiar presidentes existentes (ficticios)
        Presidente::query()->forceDelete();

        // =====================================================
        // PERIODO DE FUNDACIÓN Y PRIMEROS DIRECTIVOS (1926~)
        // Profesión = abreviatura exacta del MD (Sr., Dr., etc.)
        // =====================================================
        $fundadores = [
            [
                'nombres' => 'Lorenzo',
                'apellidos' => 'Rojas Rocha',
                'profesion' => 'Sr.',
                'periodo_inicio' => 1926,
                'periodo_fin' => null,
                'biografia' => 'Primer Presidente del Conjunto Pandillero Lira Puno.',
                'orden' => 1,
            ],
            [
                'nombres' => 'Luis N.',
                'apellidos' => 'Chevarria',
                'profesion' => 'Sr.',
                'periodo_inicio' => 1926,
                'periodo_fin' => null,
                'biografia' => 'Asumió la Presidencia tras la renuncia del titular.',
                'orden' => 2,
            ],
            [
                'nombres' => 'Valerio',
                'apellidos' => 'Salas Cabrera',
                'profesion' => 'Sr.',
                'periodo_inicio' => null,
                'periodo_fin' => null,
                'orden' => 3,
            ],
            [
                // Solo se conoce como "Sr. Rivas"
                'nombres' => '',
                'apellidos' => 'Rivas',
                'profesion' => 'Sr.',
                'periodo_inicio' => null,
                'periodo_fin' => null,
                'biografia' => 'Presidente de la Caja de Depósitos y Consignaciones.',
                'orden' => 4,
            ],
            [
                'nombres' => 'Juan',
                'apellidos' => 'Zea Gonzales',
                'profesion' => 'Sr.',
                'periodo_inicio' => null,
                'periodo_fin' => null,
                'orden' => 5,
            ],
            [
                'nombres' => 'Nataniel',
                'apellidos' => 'Berolatty',
                'profesion' => 'Sr.',
                'periodo_inicio' => null,
                'periodo_fin' => null,
                'orden' => 6,
            ],
            [
                'nombres' => 'Manuel',
                'apellidos' => 'Cossío Riega',
                'profesion' => 'Sr.',
                'periodo_inicio' => null,
                'periodo_fin' => null,
                'orden' => 7,
            ],
            [
                'nombres' => 'David',
                'apellidos' => 'Frisancho Pineda',
                'profesion' => 'Dr.',
                'periodo_inicio' => null,
                'periodo_fin' => null,
                'biografia' => 'Presidente por muchos años.',
                'orden' => 8,
            ],
        ];

        foreach ($fundadores as $data) {
            Presidente::create(array_merge($data, [
                'es_actual' => false,
                'is_published' => true,
            ]));
        }

        // =====================================================
        // SUCESIÓN CRONOLÓGICA DE LA ERA MODERNA
        // Profesión = abreviatura exacta del MD
        // Sin título en MD = profesion null
        // =====================================================
        $modernos = [
            ['nombres' => 'Hugo', 'apellidos' => 'Barriga Rivera', 'profesion' => 'Dr.', 'periodo_inicio' => 1993, 'periodo_fin' => 1994, 'orden' => 9],
            ['nombres' => 'Percy', 'apellidos' => 'Barriga Rivera', 'profesion' => 'Dr.', 'periodo_inicio' => 1994, 'periodo_fin' => 1995, 'orden' => 10],
            ['nombres' => 'Hilario', 'apellidos' => 'Dueñas Macedo', 'profesion' => 'Prof.', 'periodo_inicio' => 1995, 'periodo_fin' => 1996, 'orden' => 11],
            ['nombres' => 'Héctor', 'apellidos' => 'Garnica Rosado', 'profesion' => 'Dr.', 'periodo_inicio' => 1996, 'periodo_fin' => 1997, 'orden' => 12],
            ['nombres' => 'José', 'apellidos' => 'Patiño Barriga', 'profesion' => 'CPC', 'periodo_inicio' => 1997, 'periodo_fin' => 1998, 'orden' => 13],
            ['nombres' => 'Hugo', 'apellidos' => 'Alarcón Machicao', 'profesion' => 'Sr.', 'periodo_inicio' => 1998, 'periodo_fin' => 1999, 'orden' => 14],
            ['nombres' => 'Soledad', 'apellidos' => 'Loza Huarachi', 'profesion' => 'Prof.', 'periodo_inicio' => 1999, 'periodo_fin' => 2000, 'orden' => 15],
            ['nombres' => 'Lucio', 'apellidos' => 'Avila Rojas', 'profesion' => 'Dr.', 'periodo_inicio' => 2000, 'periodo_fin' => 2002, 'orden' => 16],
            ['nombres' => 'Alberto', 'apellidos' => 'Choque Valencia', 'profesion' => 'Prof.', 'periodo_inicio' => 2002, 'periodo_fin' => 2003, 'orden' => 17],
            ['nombres' => 'Cesar', 'apellidos' => 'Pineda Chayña', 'profesion' => 'Ing.', 'periodo_inicio' => 2003, 'periodo_fin' => 2004, 'orden' => 18],
            ['nombres' => 'Fredy Alfredo', 'apellidos' => 'Vidangos Miraval', 'profesion' => 'Sr.', 'periodo_inicio' => 2004, 'periodo_fin' => 2005, 'orden' => 19],
            ['nombres' => 'Juan', 'apellidos' => 'Álvarez Ticona', 'profesion' => 'Sr.', 'periodo_inicio' => 2005, 'periodo_fin' => 2006, 'orden' => 20],
            ['nombres' => 'Zenobia', 'apellidos' => 'Rodríguez de Reyes', 'profesion' => 'Sra.', 'periodo_inicio' => 2006, 'periodo_fin' => 2007, 'orden' => 21],
            ['nombres' => 'Evaristo', 'apellidos' => 'Machaca Sucasaca', 'profesion' => 'Prof.', 'periodo_inicio' => 2007, 'periodo_fin' => 2008, 'orden' => 22],
            ['nombres' => 'Lucio', 'apellidos' => 'Ávila Rojas', 'profesion' => 'Dr.', 'periodo_inicio' => 2008, 'periodo_fin' => 2009, 'orden' => 23],
            ['nombres' => 'Félix', 'apellidos' => 'Olaguivel Loza', 'profesion' => 'Ing.', 'periodo_inicio' => 2009, 'periodo_fin' => 2010, 'orden' => 24],
            ['nombres' => 'Wilfredo', 'apellidos' => 'Serruto Mansilla', 'profesion' => 'Prof.', 'periodo_inicio' => 2010, 'periodo_fin' => 2011, 'orden' => 25],
            ['nombres' => 'Bernabé', 'apellidos' => 'Canqui Flores', 'profesion' => 'Dr.', 'periodo_inicio' => 2011, 'periodo_fin' => 2012, 'orden' => 26],
            ['nombres' => 'Soledad', 'apellidos' => 'Loza Huarachi', 'profesion' => 'Prof.', 'periodo_inicio' => 2012, 'periodo_fin' => 2013, 'orden' => 27],
            ['nombres' => 'Rufina', 'apellidos' => 'Capacoila Coaquira', 'profesion' => 'Sra.', 'periodo_inicio' => 2013, 'periodo_fin' => 2014, 'orden' => 28],
            ['nombres' => 'Oscar', 'apellidos' => 'Llanque', 'profesion' => 'Ing.', 'periodo_inicio' => 2014, 'periodo_fin' => 2015, 'orden' => 29],
            ['nombres' => 'Gerardo', 'apellidos' => 'Núñez', 'profesion' => 'Sr.', 'periodo_inicio' => 2015, 'periodo_fin' => 2016, 'orden' => 30],
            ['nombres' => 'Hugo', 'apellidos' => 'Lipa Quina', 'profesion' => 'Ing.', 'periodo_inicio' => 2016, 'periodo_fin' => 2017, 'orden' => 31],
            ['nombres' => 'Victoria', 'apellidos' => 'Velazco Zevallos', 'profesion' => 'Sra.', 'periodo_inicio' => 2017, 'periodo_fin' => 2018, 'orden' => 32],
            ['nombres' => 'Víctor', 'apellidos' => 'Gonzales Ríos', 'profesion' => 'Ing.', 'periodo_inicio' => 2018, 'periodo_fin' => 2019, 'orden' => 33],
            ['nombres' => 'Dante', 'apellidos' => 'Paredes Cabrera', 'profesion' => 'CPC', 'periodo_inicio' => 2019, 'periodo_fin' => 2020, 'orden' => 34],
            ['nombres' => 'Santiago', 'apellidos' => 'Sayre Mamani', 'periodo_inicio' => 2021, 'periodo_fin' => 2024, 'orden' => 35],
            ['nombres' => 'Vilma', 'apellidos' => 'Ramos Vda. de Nuñez', 'periodo_inicio' => 2024, 'periodo_fin' => 2027, 'es_actual' => true, 'orden' => 36],
        ];

        foreach ($modernos as $data) {
            Presidente::create(array_merge([
                'es_actual' => false,
                'is_published' => true,
            ], $data));
        }

        $total = Presidente::count();
        $this->command->info("Presidentes seeded: {$total} registros.");
    }
}
