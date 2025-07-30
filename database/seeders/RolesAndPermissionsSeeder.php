<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Resetear caché de roles y permisos
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Crear permisos
        $permissions = [
            // Permisos de ministerios
            'view ministries',
            'create ministries',
            'edit ministries',
            'delete ministries',
            'manage ministry servers',

            // Permisos de servidores
            'view servers',
            'create servers',
            'edit servers',
            'delete servers',
            'assign servers',

            // Permisos de eventos
            'view events',
            'create events',
            'edit events',
            'delete events',
            'manage event schedules',

            // Permisos de horarios
            'view schedules',
            'create schedules',
            'edit schedules',
            'delete schedules',

            // Permisos de recursos
            'view resources',
            'create resources',
            'edit resources',
            'delete resources',
            'share resources',

            // Permisos administrativos
            'manage users',
            'manage roles',
            'view reports',
            'system admin',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Crear roles en español

        // Pastor/Líder Principal - acceso completo
        $pastor = Role::create(['name' => 'Pastor']);
        $pastor->givePermissionTo(Permission::all());

        // Líder de Iglesia - casi acceso completo excepto configuración del sistema
        $liderIglesia = Role::create(['name' => 'Líder de Iglesia']);
        $liderIglesia->givePermissionTo(Permission::whereNotIn('name', ['system admin'])->get());

        // Líder de Ministerio - permisos limitados a su área
        $liderMinisterio = Role::create(['name' => 'Líder de Ministerio']);
        $liderMinisterio->givePermissionTo([
            'view ministries',
            'edit ministries', // Solo su ministerio
            'manage ministry servers',
            'view servers',
            'create servers',
            'edit servers',
            'assign servers',
            'view events',
            'create events',
            'edit events',
            'manage event schedules',
            'view schedules',
            'create schedules',
            'edit schedules',
            'view resources',
            'create resources',
            'edit resources',
            'share resources',
        ]);

        // Servidor/Voluntario - permisos de solo lectura principalmente
        $servidor = Role::create(['name' => 'Servidor']);
        $servidor->givePermissionTo([
            'view ministries',
            'view servers',
            'view events',
            'view schedules',
            'view resources',
        ]);

        // Usuario Pendiente - sin permisos hasta que se asigne rol
        $pendiente = Role::create(['name' => 'Pendiente']);
        // Sin permisos - no puede acceder al dashboard hasta ser aprobado
    }
}
