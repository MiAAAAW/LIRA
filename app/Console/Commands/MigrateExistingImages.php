<?php

namespace App\Console\Commands;

use App\Models\Distincion;
use App\Models\Estandarte;
use App\Models\Presidente;
use App\Models\Publicacion;
use App\Services\ImageProcessingService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigrateExistingImages extends Command
{
    protected $signature = 'images:migrate
        {--dry-run : Simula la migración sin realizar cambios}
        {--model= : Migrar solo un modelo específico (estandartes, presidentes, publicaciones, distinciones)}
        {--force : Forzar reprocesamiento de imágenes ya migradas}';

    protected $description = 'Migra imágenes existentes al nuevo sistema de procesamiento con thumbnails y WebP';

    protected int $processed = 0;
    protected int $skipped = 0;
    protected int $errors = 0;

    public function __construct(
        protected ImageProcessingService $imageService
    ) {
        parent::__construct();
    }

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $specificModel = $this->option('model');
        $force = $this->option('force');

        if ($isDryRun) {
            $this->warn('MODO DRY-RUN: No se realizarán cambios reales.');
            $this->newLine();
        }

        $models = $this->getModelsToProcess($specificModel);

        if (empty($models)) {
            $this->error("Modelo no encontrado: {$specificModel}");
            return Command::FAILURE;
        }

        foreach ($models as $modelConfig) {
            $this->processModel($modelConfig, $isDryRun, $force);
        }

        $this->newLine();
        $this->info('Resumen de migración:');
        $this->table(
            ['Métrica', 'Cantidad'],
            [
                ['Procesadas', $this->processed],
                ['Omitidas', $this->skipped],
                ['Errores', $this->errors],
            ]
        );

        return $this->errors > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    protected function getModelsToProcess(?string $specific): array
    {
        $all = [
            [
                'class' => Estandarte::class,
                'name' => 'estandartes',
                'type' => 'estandartes',
                'field' => 'imagen_principal',
                'gallery' => 'galeria',
            ],
            [
                'class' => Presidente::class,
                'name' => 'presidentes',
                'type' => 'presidentes',
                'field' => 'foto',
                'gallery' => null,
            ],
            [
                'class' => Publicacion::class,
                'name' => 'publicaciones',
                'type' => 'publicaciones',
                'field' => 'imagen_portada',
                'gallery' => null,
            ],
            [
                'class' => Distincion::class,
                'name' => 'distinciones',
                'type' => 'distinciones',
                'field' => 'imagen',
                'gallery' => 'galeria',
            ],
        ];

        if ($specific) {
            return array_filter($all, fn($m) => $m['name'] === $specific);
        }

        return $all;
    }

    protected function processModel(array $config, bool $isDryRun, bool $force): void
    {
        $this->info("Procesando {$config['name']}...");

        $query = $config['class']::query();

        // Si no es force, solo procesar las que no han sido migradas
        if (!$force) {
            $query->where(function ($q) use ($config) {
                $q->whereNotNull($config['field'])
                    ->where($config['field'], 'not like', '%/originals/%');
            });
        } else {
            $query->whereNotNull($config['field']);
        }

        $items = $query->get();

        if ($items->isEmpty()) {
            $this->line("  No hay imágenes por migrar en {$config['name']}");
            return;
        }

        $bar = $this->output->createProgressBar($items->count());
        $bar->start();

        foreach ($items as $item) {
            try {
                $this->migrateItem($item, $config, $isDryRun);
                $bar->advance();
            } catch (\Exception $e) {
                $this->errors++;
                $this->newLine();
                $this->error("  Error en ID {$item->id}: {$e->getMessage()}");
            }
        }

        $bar->finish();
        $this->newLine();
    }

    protected function migrateItem($item, array $config, bool $isDryRun): void
    {
        $field = $config['field'];
        $oldPath = $item->{$field};

        if (empty($oldPath)) {
            $this->skipped++;
            return;
        }

        // Si ya está migrada y no es force, saltar
        if (str_contains($oldPath, '/originals/')) {
            $this->skipped++;
            return;
        }

        // Verificar que el archivo existe
        if (!Storage::disk('public')->exists($oldPath)) {
            $this->newLine();
            $this->warn("  Archivo no encontrado: {$oldPath}");
            $this->skipped++;
            return;
        }

        if ($isDryRun) {
            $this->newLine();
            $this->line("  [DRY-RUN] Migraría: {$oldPath}");
            $this->processed++;
            return;
        }

        // Usar el service para procesar la imagen existente
        $paths = $this->imageService->processFromPath($oldPath, $config['type']);

        if ($paths) {
            $item->{$field} = $paths['original'];
            $item->save();
            $this->processed++;

            // Eliminar archivo original (ahora hay copia en originals)
            Storage::disk('public')->delete($oldPath);
        } else {
            $this->errors++;
        }

        // Procesar galería si existe
        if ($config['gallery'] && !empty($item->{$config['gallery']})) {
            $this->migrateGallery($item, $config, $isDryRun);
        }
    }

    protected function migrateGallery($item, array $config, bool $isDryRun): void
    {
        $galleryField = $config['gallery'];
        $gallery = $item->{$galleryField};
        $newGallery = [];
        $hasChanges = false;

        foreach ($gallery as $oldPath) {
            // Si ya está migrada, mantener
            if (str_contains($oldPath, '/originals/')) {
                $newGallery[] = $oldPath;
                continue;
            }

            if (!Storage::disk('public')->exists($oldPath)) {
                $hasChanges = true;
                continue;
            }

            if ($isDryRun) {
                $this->newLine();
                $this->line("  [DRY-RUN] Migraría galería: {$oldPath}");
                $newGallery[] = $oldPath;
                continue;
            }

            $paths = $this->imageService->processFromPath($oldPath, $config['type']);
            if ($paths) {
                $newGallery[] = $paths['original'];
                Storage::disk('public')->delete($oldPath);
                $hasChanges = true;
            } else {
                $newGallery[] = $oldPath;
            }
        }

        if (!$isDryRun && $hasChanges) {
            $item->{$galleryField} = $newGallery;
            $item->save();
        }
    }
}
