<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('presidentes', function (Blueprint $table) {
            $table->id();
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('foto')->nullable();
            $table->year('periodo_inicio');
            $table->year('periodo_fin')->nullable();
            $table->boolean('es_actual')->default(false);
            $table->string('profesion')->nullable();
            $table->text('biografia')->nullable();
            $table->longText('logros')->nullable();
            $table->string('email')->nullable();
            $table->string('telefono')->nullable();
            $table->json('redes_sociales')->nullable();
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presidentes');
    }
};
