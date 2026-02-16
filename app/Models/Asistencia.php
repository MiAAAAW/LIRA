<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    use HasFactory;

    protected $table = 'asistencias';

    const ESTADOS = [
        'presente' => 'Presente',
        'ausente' => 'Ausente',
        'tardanza' => 'Tardanza',
        'justificado' => 'Justificado',
    ];

    protected $fillable = [
        'evento_id',
        'miembro_id',
        'estado',
        'observacion',
    ];

    // Relationships
    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }

    public function miembro()
    {
        return $this->belongsTo(Miembro::class);
    }

    public function logs()
    {
        return $this->hasMany(AsistenciaLog::class);
    }
}
