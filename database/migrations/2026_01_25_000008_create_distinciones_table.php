<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distinciones', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('tipo'); // Reconocimiento, Premio, Medalla, Diploma
            $table->string('otorgante'); // Institución que otorga
            $table->date('fecha_otorgamiento');
            $table->string('lugar')->nullable();
            $table->text('descripcion');
            $table->longText('contenido')->nullable();
            $table->string('imagen')->nullable();
            $table->json('galeria')->nullable();
            $table->string('documento_pdf')->nullable();
            $table->string('resolucion')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('distinciones');
    }
};
