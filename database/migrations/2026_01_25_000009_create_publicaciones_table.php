<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('publicaciones', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('tipo'); // Libro, Revista, Artículo, Investigación
            $table->string('autor');
            $table->string('editorial')->nullable();
            $table->string('isbn')->nullable();
            $table->year('anio_publicacion')->nullable();
            $table->string('edicion')->nullable();
            $table->integer('paginas')->nullable();
            $table->text('descripcion');
            $table->longText('resumen')->nullable();
            $table->string('imagen_portada');
            $table->string('documento_pdf')->nullable();
            $table->string('enlace_compra')->nullable();
            $table->string('enlace_descarga')->nullable();
            $table->decimal('precio', 8, 2)->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('publicaciones');
    }
};
