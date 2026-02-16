<?php

namespace App\Models;

use App\Traits\HasProcessedImages;
use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Presidente extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope, HasProcessedImages;

    protected $table = 'presidentes';

    protected $fillable = [
        'nombres',
        'apellidos',
        'foto',
        'periodo_inicio',
        'periodo_fin',
        'es_actual',
        'profesion',
        'biografia',
        'logros',
        'email',
        'telefono',
        'redes_sociales',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'redes_sociales' => 'array',
        'es_actual' => 'boolean',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'image_url',
        'thumbnail_url',
        'webp_url',
        'nombre_completo',
        'nombre_con_titulo',
        'periodo',
    ];

    /**
     * Obtener nombre completo (sin título)
     */
    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->nombres} {$this->apellidos}");
    }

    /**
     * Obtener nombre con título/profesión antepuesto
     * Ej: "Dr. Hugo Barriga Rivera", "Prof. Soledad Loza Huarachi"
     */
    public function getNombreConTituloAttribute(): string
    {
        $nombre = $this->nombre_completo;

        return $this->profesion
            ? "{$this->profesion} {$nombre}"
            : $nombre;
    }

    /**
     * Obtener periodo formateado
     */
    public function getPeriodoAttribute(): string
    {
        if (!$this->periodo_inicio) {
            return 'Periodo fundacional';
        }

        if ($this->periodo_fin) {
            return "{$this->periodo_inicio} - {$this->periodo_fin}";
        }

        return $this->es_actual
            ? "{$this->periodo_inicio} - Presente"
            : (string) $this->periodo_inicio;
    }

    /**
     * Scope para presidente actual
     */
    public function scopeActual($query)
    {
        return $query->where('es_actual', true);
    }

    /**
     * Tipo de imagen para procesamiento
     */
    public function getImageType(): string
    {
        return 'presidentes';
    }

    /**
     * Campo de imagen principal
     */
    public function getImageField(): string
    {
        return 'foto';
    }
}
