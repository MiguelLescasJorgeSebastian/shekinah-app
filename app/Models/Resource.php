<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resource extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type',
        'content',
        'file_path',
        'shared_with_ministries',
        'created_by',
        'ministry_id',
        'is_public',
    ];

    protected $casts = [
        'shared_with_ministries' => 'array',
        'is_public' => 'boolean',
    ];

    // Relación con el creador del recurso
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relación con el ministerio propietario
    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    // Obtener ministerios con acceso
    public function getSharedMinistriesModels()
    {
        if (!$this->shared_with_ministries) {
            return collect();
        }

        return Ministry::whereIn('id', $this->shared_with_ministries)->get();
    }
}
