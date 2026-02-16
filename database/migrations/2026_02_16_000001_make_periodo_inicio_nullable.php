<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('presidentes', function (Blueprint $table) {
            $table->year('periodo_inicio')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('presidentes', function (Blueprint $table) {
            $table->year('periodo_inicio')->nullable(false)->change();
        });
    }
};
