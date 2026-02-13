<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    private const CACHE_TTL = 60; // seconds

    /**
     * Get a setting value by key.
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        return Cache::remember("site_setting.{$key}", self::CACHE_TTL, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value by key.
     */
    public static function setValue(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("site_setting.{$key}");
        Cache::forget('site_settings.section_visibility');
    }

    /**
     * Check if a section is visible.
     */
    public static function isSectionVisible(string $sectionKey): bool
    {
        return (bool) static::getValue("section_visible_{$sectionKey}", '1');
    }

    /**
     * Get visibility for all sections (batch, cached).
     */
    public static function getSectionVisibility(): array
    {
        return Cache::remember('site_settings.section_visibility', self::CACHE_TTL, function () {
            $settings = static::where('key', 'like', 'section_visible_%')->pluck('value', 'key');

            $sections = [
                'ley24325', 'base_legal', 'indecopi', 'estandartes', 'presidentes',
                'videos', 'audios', 'distinciones', 'publicaciones', 'comunicados',
            ];

            $result = [];
            foreach ($sections as $section) {
                $result[$section] = (bool) ($settings["section_visible_{$section}"] ?? '1');
            }

            return $result;
        });
    }

    /**
     * Toggle a section's visibility and return the new value.
     */
    public static function toggleSection(string $sectionKey): bool
    {
        $current = static::isSectionVisible($sectionKey);
        $newValue = !$current;
        static::setValue("section_visible_{$sectionKey}", $newValue ? '1' : '0');
        return $newValue;
    }
}
