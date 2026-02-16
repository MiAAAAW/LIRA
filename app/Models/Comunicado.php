<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comunicado extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'comunicados';

    protected $fillable = [
        'titulo',
        'tipo',
        'numero',
        'fecha',
        'extracto',
        'contenido',
        'imagen',
        'r2_image_key',
        'r2_image_url',
        'archivos_adjuntos',
        'firmante',
        'cargo_firmante',
        'fecha_vigencia',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $appends = ['image_url'];

    protected $casts = [
        'fecha' => 'date',
        'fecha_vigencia' => 'date',
        'archivos_adjuntos' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public const TIPOS = [
        'comunicado' => 'Comunicado',
        'nota_prensa' => 'Nota de Prensa',
        'aviso' => 'Aviso',
        'convocatoria' => 'Convocatoria',
        'pronunciamiento' => 'Pronunciamiento',
    ];

    /**
     * URL de la imagen (prioriza CDN sobre local)
     */
    public function getImageUrlAttribute(): ?string
    {
        if ($this->r2_image_url) {
            return $this->r2_image_url;
        }

        if ($this->imagen) {
            return asset('storage/' . $this->imagen);
        }

        return null;
    }

    /**
     * Verificar si está vigente
     */
    public function estaVigente(): bool
    {
        if (is_null($this->fecha_vigencia)) {
            return true;
        }
        return $this->fecha_vigencia->isFuture();
    }

    /**
     * Scope para comunicados vigentes
     */
    public function scopeVigentes($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('fecha_vigencia')
              ->orWhere('fecha_vigencia', '>=', now());
        });
    }
}
