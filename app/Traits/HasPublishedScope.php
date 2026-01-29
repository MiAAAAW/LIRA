<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait HasPublishedScope
{
    /**
     * Scope para obtener solo registros publicados
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope para obtener registros ordenados por fecha
     */
    public function scopeLatest(Builder $query, string $column = 'created_at'): Builder
    {
        return $query->orderByDesc($column);
    }

    /**
     * Scope para obtener registros destacados
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Verificar si está publicado
     */
    public function isPublished(): bool
    {
        return $this->is_published ?? false;
    }

    /**
     * Publicar el registro
     */
    public function publish(): bool
    {
        return $this->update(['is_published' => true]);
    }

    /**
     * Despublicar el registro
     */
    public function unpublish(): bool
    {
        return $this->update(['is_published' => false]);
    }
}
