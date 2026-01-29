<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Presidente extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

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

    /**
     * Obtener nombre completo
     */
    public function getNombreCompletoAttribute(): string
    {
        return "{$this->nombres} {$this->apellidos}";
    }

    /**
     * Obtener periodo formateado
     */
    public function getPeriodoAttribute(): string
    {
        $fin = $this->periodo_fin ?? 'Presente';
        return "{$this->periodo_inicio} - {$fin}";
    }

    /**
     * Scope para presidente actual
     */
    public function scopeActual($query)
    {
        return $query->where('es_actual', true);
    }
}
