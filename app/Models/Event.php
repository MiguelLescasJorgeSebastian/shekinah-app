<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type',
        'start_datetime',
        'end_datetime',
        'location',
        'required_ministries',
        'status',
        'created_by',
        'is_recurring',
        'recurrence_type',
        'recurrence_config',
        'recurrence_end_date',
        
        'parent_event_id',
    ];

    protected $casts = [
        'start_datetime' => 'datetime',
        'end_datetime' => 'datetime',
        'required_ministries' => 'array',
        'recurrence_config' => 'array',
        'is_recurring' => 'boolean',
        'recurrence_end_date' => 'date',
    ];

    // Relación con el creador del evento
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Relación con horarios del evento
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    // Relación con evento padre (para eventos recurrentes)
    public function parentEvent(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'parent_event_id');
    }

    // Relación con instancias del evento (para eventos recurrentes)
    public function childEvents(): HasMany
    {
        return $this->hasMany(Event::class, 'parent_event_id');
    }

    // Obtener ministerios requeridos
    public function getRequiredMinistriesModels()
    {
        if (empty($this->required_ministries)) {
            return collect();
        }

        return Ministry::whereIn('id', $this->required_ministries)->get();
    }

    // Generar instancias de eventos recurrentes
    public function generateRecurringInstances()
    {
        if (!$this->is_recurring || empty($this->recurrence_type)) {
            return;
        }

        $instances = [];
        $currentDate = $this->start_datetime->copy();
        $endDate = $this->recurrence_end_date ?: $this->start_datetime->copy()->addYear();

        while ($currentDate->lte($endDate)) {
            $currentDate = $this->getNextOccurrence($currentDate);

            if ($currentDate && $currentDate->lte($endDate)) {
                $duration = $this->end_datetime->diffInMinutes($this->start_datetime);

                $instances[] = [
                    'name' => $this->name,
                    'description' => $this->description,
                    'type' => $this->type,
                    'start_datetime' => $currentDate,
                    'end_datetime' => $currentDate->copy()->addMinutes($duration),
                    'location' => $this->location,
                    'required_ministries' => $this->required_ministries,
                    'status' => 'planned',
                    'created_by' => $this->created_by,
                    'parent_event_id' => $this->id,
                    'is_recurring' => false,
                ];
            }
        }

        // Insertar instancias en lotes
        if (!empty($instances)) {
            Event::insert($instances);
        }
    }

    private function getNextOccurrence($currentDate)
    {
        $config = $this->recurrence_config ?? [];

        switch ($this->recurrence_type) {
            case 'weekly':
                $dayOfWeek = $config['day_of_week'] ?? $this->start_datetime->dayOfWeek;
                return $currentDate->next($dayOfWeek);

            case 'biweekly':
                $dayOfWeek = $config['day_of_week'] ?? $this->start_datetime->dayOfWeek;
                return $currentDate->addWeeks(2)->next($dayOfWeek);

            case 'monthly':
                $dayOfMonth = $config['day_of_month'] ?? $this->start_datetime->day;
                return $currentDate->addMonth()->day($dayOfMonth);

            case 'daily':
                $interval = $config['interval'] ?? 1;
                return $currentDate->addDays($interval);

            default:
                return null;
        }
    }
}
