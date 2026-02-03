<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Simplificar tabla estandartes:
     * - tipo: nullable con default 'principal'
     * - descripcion: nullable
     */
    public function up(): void
    {
        Schema::table('estandartes', function (Blueprint $table) {
            $table->string('tipo')->nullable()->default('principal')->change();
            $table->text('descripcion')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('estandartes', function (Blueprint $table) {
            $table->string('tipo')->nullable(false)->default(null)->change();
            $table->text('descripcion')->nullable(false)->change();
        });
    }
};
