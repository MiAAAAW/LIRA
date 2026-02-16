<?php

namespace App\Models;

use App\Traits\HasProcessedImages;
use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Miembro extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope, HasProcessedImages;

    protected $table = 'miembros';

    const TIPOS = [
        'danzante' => 'Danzante',
        'directivo' => 'Directivo',
    ];

    const CARGOS = [
        'presidente' => 'Presidente',
        'vicepresidente' => 'Vicepresidente',
        'secretario' => 'Secretario',
        'tesorero' => 'Tesorero',
        'fiscal' => 'Fiscal',
        'vocal' => 'Vocal',
        'delegado' => 'Delegado',
    ];

    protected $fillable = [
        'nombres',
        'apellidos',
        'dni',
        'telefono',
        'email',
        'tipo',
        'cargo',
        'anio_ingreso',
        'is_active',
        'foto',
        'notas',
        'anios_activo',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'anios_activo' => 'array',
        'is_active' => 'boolean',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'image_url',
        'thumbnail_url',
        'webp_url',
        'nombre_completo',
    ];

    public function getNombreCompletoAttribute(): string
    {
        return "{$this->apellidos}, {$this->nombres}";
    }

    // Relationships
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class);
    }

    public function sanciones()
    {
        return $this->hasMany(Sancion::class);
    }

    // Scopes
    public function scopeActivos($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDanzantes($query)
    {
        return $query->where('tipo', 'danzante');
    }

    public function scopeDirectivos($query)
    {
        return $query->where('tipo', 'directivo');
    }

    public function getImageType(): string
    {
        return 'miembros';
    }

    public function getImageField(): string
    {
        return 'foto';
    }
}
