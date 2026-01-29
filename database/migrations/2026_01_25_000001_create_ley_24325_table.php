<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ley_24325', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('numero_ley')->nullable();
            $table->date('fecha_promulgacion')->nullable();
            $table->text('descripcion')->nullable();
            $table->longText('contenido')->nullable();
            $table->string('documento_pdf')->nullable();
            $table->string('imagen')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ley_24325');
    }
};
