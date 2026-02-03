<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distinciones', function (Blueprint $table) {
            $table->string('r2_pdf_key')->nullable()->after('documento_pdf');
            $table->string('r2_pdf_url')->nullable()->after('r2_pdf_key');
        });
    }

    public function down(): void
    {
        Schema::table('distinciones', function (Blueprint $table) {
            $table->dropColumn(['r2_pdf_key', 'r2_pdf_url']);
        });
    }
};
