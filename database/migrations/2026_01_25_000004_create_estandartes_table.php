<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('estandartes', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('tipo'); // Principal, Histórico, Conmemorativo
            $table->year('anio')->nullable();
            $table->string('autor')->nullable();
            $table->string('donante')->nullable();
            $table->text('descripcion');
            $table->longText('historia')->nullable();
            $table->string('imagen_principal')->nullable();
            $table->json('galeria')->nullable(); // Array de imágenes adicionales
            $table->string('dimensiones')->nullable();
            $table->string('materiales')->nullable();
            $table->string('ubicacion_actual')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('estandartes');
    }
};
