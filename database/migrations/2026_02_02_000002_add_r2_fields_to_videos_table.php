<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            // Cloudflare R2 storage fields
            $table->string('r2_key')->nullable()->after('thumbnail');
            $table->string('r2_video_url')->nullable()->after('r2_key');
            $table->string('r2_thumbnail_url')->nullable()->after('r2_video_url');
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropColumn(['r2_key', 'r2_video_url', 'r2_thumbnail_url']);
        });
    }
};
