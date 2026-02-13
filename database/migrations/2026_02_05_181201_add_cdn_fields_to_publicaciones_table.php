<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('publicaciones', function (Blueprint $table) {
            // CDN fields for PDF (Cloudflare R2)
            $table->string('r2_pdf_key')->nullable()->after('documento_pdf');
            $table->string('r2_pdf_url')->nullable()->after('r2_pdf_key');

            // Enlace externo (alternativa a PDF)
            $table->string('enlace_externo')->nullable()->after('enlace_descarga');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('publicaciones', function (Blueprint $table) {
            $table->dropColumn(['r2_pdf_key', 'r2_pdf_url', 'enlace_externo']);
        });
    }
};
