<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('tipo_fuente'); // youtube, vimeo, cloudinary, local
            $table->string('url_video');
            $table->string('video_id')->nullable(); // ID del video en la plataforma
            $table->string('thumbnail')->nullable();
            $table->string('duracion')->nullable();
            $table->year('anio')->nullable();
            $table->string('categoria')->nullable(); // Presentación, Documental, Entrevista
            $table->string('evento')->nullable();
            $table->string('ubicacion')->nullable();
            $table->integer('vistas')->default(0);
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
