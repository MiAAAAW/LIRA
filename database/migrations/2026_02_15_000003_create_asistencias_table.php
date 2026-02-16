<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evento_id')->constrained('eventos')->cascadeOnDelete();
            $table->foreignId('miembro_id')->constrained('miembros')->cascadeOnDelete();
            $table->enum('estado', ['presente', 'ausente', 'tardanza', 'justificado']);
            $table->text('observacion')->nullable();
            $table->timestamps();

            $table->unique(['evento_id', 'miembro_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asistencias');
    }
};
