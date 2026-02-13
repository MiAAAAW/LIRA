<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default section visibility (all visible)
        $sections = [
            'ley24325',
            'base_legal',
            'indecopi',
            'estandartes',
            'presidentes',
            'videos',
            'audios',
            'distinciones',
            'publicaciones',
            'comunicados',
        ];

        $now = now();
        foreach ($sections as $section) {
            DB::table('site_settings')->insert([
                'key' => "section_visible_{$section}",
                'value' => '1',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
