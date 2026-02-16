<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_configs', function (Blueprint $table) {
            $table->id();

            // Textos
            $table->string('titulo_principal');
            $table->string('titulo_highlight')->nullable();
            $table->string('titulo_sufijo')->nullable();
            $table->string('subtitulo')->nullable();
            $table->string('anios')->nullable();
            $table->text('descripcion')->nullable();

            // Badge
            $table->string('badge_texto')->nullable();
            $table->string('badge_variante')->default('outline');

            // CTA
            $table->string('cta_texto')->nullable();
            $table->string('cta_href')->nullable();
            $table->string('cta_secundario_texto')->nullable();
            $table->string('cta_secundario_href')->nullable();

            // Media (R2 direct upload — video o imagen)
            $table->string('r2_key_media')->nullable();
            $table->string('media_url')->nullable();

            // Stats (JSON)
            $table->json('stats')->nullable();

            // Control
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('orden')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_configs');
    }
};
