<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sanciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('miembro_id')->constrained('miembros')->cascadeOnDelete();
            $table->foreignId('evento_id')->nullable()->constrained('eventos')->nullOnDelete();
            $table->enum('tipo', ['multa', 'amonestacion', 'suspension'])->default('multa');
            $table->decimal('monto', 10, 2)->nullable();
            $table->string('motivo');
            $table->text('descripcion')->nullable();
            $table->enum('estado', ['pendiente', 'pagado', 'condonado'])->default('pendiente');
            $table->date('fecha');
            $table->integer('orden')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sanciones');
    }
};
