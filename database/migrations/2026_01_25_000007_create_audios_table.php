<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audios', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('tipo'); // Marinera, Huayno, Pandilla, Sikuri
            $table->string('compositor')->nullable();
            $table->string('interprete')->nullable();
            $table->string('arreglista')->nullable();
            $table->year('anio_composicion')->nullable();
            $table->year('anio_grabacion')->nullable();
            $table->string('duracion')->nullable();
            $table->string('url_audio');
            $table->string('tipo_fuente'); // soundcloud, spotify, cloudinary, local
            $table->string('thumbnail')->nullable();
            $table->text('letra')->nullable();
            $table->string('partitura_pdf')->nullable();
            $table->integer('reproducciones')->default(0);
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audios');
    }
};
