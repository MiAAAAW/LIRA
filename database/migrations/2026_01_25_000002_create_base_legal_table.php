<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('base_legal', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('tipo_documento'); // Ley, Decreto, Resolución, Ordenanza
            $table->string('numero_documento')->nullable();
            $table->date('fecha_emision')->nullable();
            $table->string('entidad_emisora')->nullable();
            $table->text('descripcion')->nullable();
            $table->longText('contenido')->nullable();
            $table->string('documento_pdf')->nullable();
            $table->string('enlace_externo')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('base_legal');
    }
};
