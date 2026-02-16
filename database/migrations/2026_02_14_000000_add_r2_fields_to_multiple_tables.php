<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Agrega campos R2 (CDN) a tablas que usan almacenamiento local.
 * Solo AGREGA columnas nullable. NO elimina ni modifica existentes.
 */
return new class extends Migration
{
    public function up(): void
    {
        // PDFs
        Schema::table('ley_24325', function (Blueprint $table) {
            $table->string('r2_pdf_key')->nullable()->after('documento_pdf');
            $table->string('r2_pdf_url')->nullable()->after('r2_pdf_key');
        });

        Schema::table('base_legal', function (Blueprint $table) {
            $table->string('r2_pdf_key')->nullable()->after('documento_pdf');
            $table->string('r2_pdf_url')->nullable()->after('r2_pdf_key');
        });

        Schema::table('registro_indecopi', function (Blueprint $table) {
            $table->string('r2_pdf_key')->nullable()->after('certificado_pdf');
            $table->string('r2_pdf_url')->nullable()->after('r2_pdf_key');
        });

        // Imagenes
        Schema::table('estandartes', function (Blueprint $table) {
            $table->string('r2_image_key')->nullable()->after('imagen_principal');
            $table->string('r2_image_url')->nullable()->after('r2_image_key');
        });

        Schema::table('comunicados', function (Blueprint $table) {
            $table->string('r2_image_key')->nullable()->after('imagen');
            $table->string('r2_image_url')->nullable()->after('r2_image_key');
        });

        Schema::table('publicaciones', function (Blueprint $table) {
            $table->string('r2_image_key')->nullable()->after('imagen_portada');
            $table->string('r2_image_url')->nullable()->after('r2_image_key');
        });
    }

    public function down(): void
    {
        Schema::table('ley_24325', function (Blueprint $table) {
            $table->dropColumn(['r2_pdf_key', 'r2_pdf_url']);
        });

        Schema::table('base_legal', function (Blueprint $table) {
            $table->dropColumn(['r2_pdf_key', 'r2_pdf_url']);
        });

        Schema::table('registro_indecopi', function (Blueprint $table) {
            $table->dropColumn(['r2_pdf_key', 'r2_pdf_url']);
        });

        Schema::table('estandartes', function (Blueprint $table) {
            $table->dropColumn(['r2_image_key', 'r2_image_url']);
        });

        Schema::table('comunicados', function (Blueprint $table) {
            $table->dropColumn(['r2_image_key', 'r2_image_url']);
        });

        Schema::table('publicaciones', function (Blueprint $table) {
            $table->dropColumn(['r2_image_key', 'r2_image_url']);
        });
    }
};
