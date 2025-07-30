<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ServerNotification extends Model
{
    protected $fillable = [
        'server_id',
        'schedule_id',
        'event_id',
        'type',
        'title',
        'message',
        'data',
        'delivery_method',
        'status',
        'scheduled_for',
        'sent_at',
        'delivered_at',
        'read_at',
        'response_token',
        'response_status',
        'response_message',
        'responded_at',
    ];

    protected $casts = [
        'data' => 'array',
        'scheduled_for' => 'datetime',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
        'responded_at' => 'datetime',
    ];

    const TYPE_ASSIGNMENT = 'assignment';
    const TYPE_REMINDER = 'reminder';
    const TYPE_CHANGE = 'change';
    const TYPE_CANCELLATION = 'cancellation';

    const STATUS_PENDING = 'pending';
    const STATUS_SENT = 'sent';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_FAILED = 'failed';
    const STATUS_READ = 'read';

    const RESPONSE_CONFIRMED = 'confirmed';
    const RESPONSE_DECLINED = 'declined';
    const RESPONSE_MAYBE = 'maybe';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($notification) {
            if (empty($notification->response_token)) {
                $notification->response_token = Str::random(64);
            }
        });
    }

    // Relaciones
    public function server(): BelongsTo
    {
        return $this->belongsTo(Server::class);
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    // Métodos utilitarios
    public function markAsRead(): void
    {
        if (is_null($this->read_at)) {
            $this->update(['read_at' => now()]);
        }
    }

    public function markAsSent(): void
    {
        $this->update([
            'status' => self::STATUS_SENT,
            'sent_at' => now()
        ]);
    }

    public function markAsDelivered(): void
    {
        $this->update([
            'status' => self::STATUS_DELIVERED,
            'delivered_at' => now()
        ]);
    }

    public function markAsFailed(): void
    {
        $this->update(['status' => self::STATUS_FAILED]);
    }

    public function recordResponse(string $status, ?string $message = null): void
    {
        $this->update([
            'response_status' => $status,
            'response_message' => $message,
            'responded_at' => now()
        ]);
    }

    public function generateResponseUrl(string $action): string
    {
        return route('server.notification.respond', [
            'token' => $this->response_token,
            'action' => $action
        ]);
    }

    public function generateCalendarUrl(): string
    {
        if ($this->schedule) {
            return route('server.calendar.add', [
                'token' => $this->response_token
            ]);
        }

        return '#';
    }
}
