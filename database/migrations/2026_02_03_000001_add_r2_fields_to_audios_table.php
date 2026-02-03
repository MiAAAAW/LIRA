<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audios', function (Blueprint $table) {
            $table->string('r2_key')->nullable()->after('tipo_fuente');
            $table->string('r2_audio_url')->nullable()->after('r2_key');
        });
    }

    public function down(): void
    {
        Schema::table('audios', function (Blueprint $table) {
            $table->dropColumn(['r2_key', 'r2_audio_url']);
        });
    }
};
