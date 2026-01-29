<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registro_indecopi', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('numero_registro')->nullable();
            $table->string('numero_expediente')->nullable();
            $table->date('fecha_registro')->nullable();
            $table->date('fecha_renovacion')->nullable();
            $table->string('tipo_registro')->nullable(); // Marca, Denominación de Origen, etc.
            $table->string('clase_niza')->nullable();
            $table->text('descripcion')->nullable();
            $table->longText('contenido')->nullable();
            $table->string('certificado_pdf')->nullable();
            $table->string('imagen')->nullable();
            $table->string('estado')->default('vigente'); // vigente, en_tramite, vencido
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registro_indecopi');
    }
};
