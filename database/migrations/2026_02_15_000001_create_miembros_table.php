<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('miembros', function (Blueprint $table) {
            $table->id();
            $table->string('nombres');
            $table->string('apellidos');
            $table->string('dni', 20)->unique()->nullable();
            $table->string('telefono', 50)->nullable();
            $table->string('email')->nullable();
            $table->enum('tipo', ['danzante', 'directivo'])->default('danzante');
            $table->string('cargo')->nullable(); // solo directivos
            $table->year('anio_ingreso')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('foto')->nullable();
            $table->text('notas')->nullable();
            $table->json('anios_activo')->nullable(); // array de años
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('miembros');
    }
};
