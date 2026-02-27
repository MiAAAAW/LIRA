<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audios', function (Blueprint $table) {
            $table->string('r2_partitura_key')->nullable()->after('partitura_pdf');
        });
    }

    public function down(): void
    {
        Schema::table('audios', function (Blueprint $table) {
            $table->dropColumn('r2_partitura_key');
        });
    }
};
