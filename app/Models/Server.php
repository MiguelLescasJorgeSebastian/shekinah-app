<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Server extends Model
{
    protected $fillable = [
        'user_id',
        'ministry_id',
        'position',
        'skills',
        'is_active',
        'start_date',
        'end_date',
        'external_name',
        'external_email',
        'external_phone',
        'is_external',
        'email_notifications',
        'sms_notifications',
        'preferred_contact_method',
        'notification_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_external' => 'boolean',
        'email_notifications' => 'boolean',
        'sms_notifications' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($server) {
            if (empty($server->notification_token)) {
                $server->notification_token = Str::random(64);
            }
        });
    }

    // Relación con el usuario (nullable para servidores externos)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relación con el ministerio
    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    // Relación con horarios asignados
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    // Relación con notificaciones
    public function notifications(): HasMany
    {
        return $this->hasMany(ServerNotification::class);
    }

    // Accessors y métodos utilitarios
    public function getDisplayNameAttribute(): string
    {
        return $this->is_external ? $this->external_name : $this->user->name;
    }

    public function getContactEmailAttribute(): ?string
    {
        return $this->is_external ? $this->external_email : $this->user->email;
    }

    public function getContactPhoneAttribute(): ?string
    {
        return $this->is_external ? $this->external_phone : null;
    }

    public function canReceiveEmailNotifications(): bool
    {
        return $this->email_notifications &&
               in_array($this->preferred_contact_method, ['email', 'both']) &&
               !empty($this->getContactEmailAttribute());
    }

    public function canReceiveSmsNotifications(): bool
    {
        return $this->sms_notifications &&
               in_array($this->preferred_contact_method, ['sms', 'both']) &&
               !empty($this->getContactPhoneAttribute());
    }

    // Generar un nuevo token de notificación
    public function regenerateNotificationToken(): string
    {
        $this->notification_token = Str::random(64);
        $this->save();
        return $this->notification_token;
    }
}
