<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ministry extends Model
{
    protected $fillable = [
        'name',
        'description',
        'color',
        'is_active',
        'leader_id',
        'parent_ministry_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relación con el líder del ministerio
    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    // Relación con ministerio padre (para jerarquías)
    public function parentMinistry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class, 'parent_ministry_id');
    }

    // Relación con ministerios hijos
    public function childMinistries(): HasMany
    {
        return $this->hasMany(Ministry::class, 'parent_ministry_id');
    }

    // Relación con servidores
    public function servers(): HasMany
    {
        return $this->hasMany(Server::class);
    }

    // Relación con recursos
    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class);
    }

    // Relación con horarios
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }
}
