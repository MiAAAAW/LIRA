<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('publicaciones', function (Blueprint $table) {
            $table->text('descripcion')->nullable()->change();
            $table->string('imagen_portada')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('publicaciones', function (Blueprint $table) {
            $table->text('descripcion')->nullable(false)->change();
            $table->string('imagen_portada')->nullable(false)->change();
        });
    }
};
