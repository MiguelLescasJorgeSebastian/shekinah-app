<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    protected $fillable = [
        'event_id',
        'ministry_id',
        'server_id',
        'day_of_week',
        'start_time',
        'end_time',
        'notes',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
    ];

    // Relación con el evento
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    // Relación con el ministerio
    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    // Relación con el servidor asignado
    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }
}
