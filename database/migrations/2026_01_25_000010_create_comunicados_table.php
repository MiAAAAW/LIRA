<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comunicados', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('tipo'); // Comunicado, Nota de Prensa, Aviso, Convocatoria
            $table->string('numero')->nullable();
            $table->date('fecha');
            $table->text('extracto');
            $table->longText('contenido');
            $table->string('imagen')->nullable();
            $table->json('archivos_adjuntos')->nullable();
            $table->string('firmante')->nullable();
            $table->string('cargo_firmante')->nullable();
            $table->date('fecha_vigencia')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comunicados');
    }
};
