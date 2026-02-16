<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsistenciaLog extends Model
{
    use HasFactory;

    protected $table = 'asistencia_logs';

    protected $fillable = [
        'asistencia_id',
        'evento_id',
        'miembro_id',
        'estado_anterior',
        'estado_nuevo',
        'cambiado_por',
    ];

    // Relationships
    public function asistencia()
    {
        return $this->belongsTo(Asistencia::class);
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }

    public function miembro()
    {
        return $this->belongsTo(Miembro::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'cambiado_por');
    }
}
