<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DocumentPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos de documentos solo si no existen
        $documentPermissions = [
            'view documents',
            'create documents',
            'edit documents',
            'delete documents',
            'share documents',
        ];

        foreach ($documentPermissions as $permission) {
            if (!Permission::where('name', $permission)->exists()) {
                Permission::create(['name' => $permission]);
            }
        }

        // Asignar permisos a roles existentes
        $pastor = Role::where('name', 'Pastor')->first();
        if ($pastor) {
            $pastor->givePermissionTo($documentPermissions);
        }

        $liderIglesia = Role::where('name', 'Líder de Iglesia')->first();
        if ($liderIglesia) {
            $liderIglesia->givePermissionTo($documentPermissions);
        }

        $liderMinisterio = Role::where('name', 'Líder de Ministerio')->first();
        if ($liderMinisterio) {
            $liderMinisterio->givePermissionTo([
                'view documents',
                'create documents',
                'edit documents',
                'share documents',
            ]);
        }

        $servidor = Role::where('name', 'Servidor')->first();
        if ($servidor) {
            $servidor->givePermissionTo(['view documents']);
        }
    }
}
