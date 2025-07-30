<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'file_path',
        'original_filename',
        'mime_type',
        'file_size',
        'metadata',
        'ministry_id',
        'uploaded_by',
        'access_permissions',
        'is_active',
    ];

    protected $casts = [
        'metadata' => 'array',
        'access_permissions' => 'array',
        'is_active' => 'boolean',
    ];

    // Relación con el ministerio
    public function ministry(): BelongsTo
    {
        return $this->belongsTo(Ministry::class);
    }

    // Relación con el usuario que subió el documento
    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // Tipos de documentos disponibles
    public static function getTypes(): array
    {
        return [
            'song_list' => 'Lista de Cantos',
            'ministry_guide' => 'Guía de Ministerio',
            'procedure' => 'Procedimiento',
            'schedule' => 'Horario',
            'announcement' => 'Anuncio',
            'other' => 'Otro'
        ];
    }

    // Verificar si el usuario tiene acceso al documento
    public function userHasAccess(User $user): bool
    {
        // Si no hay permisos específicos, es accesible para todos los usuarios autenticados
        if (empty($this->access_permissions)) {
            return true;
        }

        // Verificar permisos por roles
        if (isset($this->access_permissions['roles'])) {
            foreach ($this->access_permissions['roles'] as $role) {
                if ($user->hasRole($role)) {
                    return true;
                }
            }
        }

        // Verificar permisos por ministerios
        if (isset($this->access_permissions['ministries'])) {
            $userMinistries = $user->ministries()->pluck('id')->toArray();
            $allowedMinistries = $this->access_permissions['ministries'];

            if (array_intersect($userMinistries, $allowedMinistries)) {
                return true;
            }
        }

        // Verificar si es el propietario
        if ($this->uploaded_by === $user->id) {
            return true;
        }

        return false;
    }

    // Obtener URL de descarga
    public function getDownloadUrl(): string
    {
        return route('documents.download', $this->id);
    }
}
