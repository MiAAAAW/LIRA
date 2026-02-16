<?php

namespace App\Models;

use App\Traits\HasPublishedScope;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sancion extends Model
{
    use HasFactory, SoftDeletes, HasPublishedScope;

    protected $table = 'sanciones';

    const TIPOS = [
        'multa' => 'Multa',
        'amonestacion' => 'Amonestación',
        'suspension' => 'Suspensión',
    ];

    const ESTADOS = [
        'pendiente' => 'Pendiente',
        'pagado' => 'Pagado',
        'condonado' => 'Condonado',
    ];

    protected $fillable = [
        'miembro_id',
        'evento_id',
        'tipo',
        'monto',
        'motivo',
        'descripcion',
        'estado',
        'fecha',
        'orden',
        'is_published',
        'is_featured',
    ];

    protected $casts = [
        'fecha' => 'date',
        'monto' => 'decimal:2',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
    ];

    protected $appends = [
        'miembro_nombre',
    ];

    public function getMiembroNombreAttribute(): ?string
    {
        return $this->miembro ? $this->miembro->nombre_completo : null;
    }

    // Relationships
    public function miembro()
    {
        return $this->belongsTo(Miembro::class);
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }
}
