<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relación con ministerios liderados
    public function leadingMinistries()
    {
        return $this->hasMany(Ministry::class, 'leader_id');
    }

    // Relación con servidores (roles de servicio)
    public function servers()
    {
        return $this->hasMany(Server::class);
    }

    // Relación con eventos creados
    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'created_by');
    }

    // Relación con recursos creados
    public function createdResources()
    {
        return $this->hasMany(Resource::class, 'created_by');
    }
}
