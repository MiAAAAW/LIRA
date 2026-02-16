<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evento extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'eventos';

    const TIPOS = [
        'ensayo' => 'Ensayo',
        'reunion' => 'Reunión',
        'presentacion' => 'Presentación',
        'otro' => 'Otro',
    ];

    protected $fillable = [
        'titulo',
        'tipo',
        'fecha',
        'hora_inicio',
        'hora_fin',
        'ubicacion',
        'descripcion',
        'estado_lista',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'fecha' => 'date',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'asistentes_count',
    ];

    public function getAsistentesCountAttribute(): int
    {
        return $this->asistencias()->count();
    }

    // Relationships
    public function asistencias()
    {
        return $this->hasMany(Asistencia::class);
    }

    public function miembros()
    {
        return $this->belongsToMany(Miembro::class, 'asistencias')
            ->withPivot('estado', 'observacion')
            ->withTimestamps();
    }

    public function isListaAbierta(): bool
    {
        return $this->estado_lista === 'abierta';
    }
}
