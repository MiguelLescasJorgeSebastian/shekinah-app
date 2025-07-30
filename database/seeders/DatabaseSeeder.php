<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar seeder de roles y permisos primero
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        // Crear usuario administrador
        $admin = User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@iglesia.com',
        ]);
        $admin->assignRole('Leader');

        // Crear usuario de prueba
        $testUser = User::factory()->create([
            'name' => 'Encargado de Prueba',
            'email' => 'encargado@iglesia.com',
        ]);
        $testUser->assignRole('Manager');

        // Crear algunos usuarios servidores
        $servers = User::factory(5)->create();
        foreach ($servers as $server) {
            $server->assignRole('Server');
        }

        // Ejecutar seeder de ministerios con datos de ejemplo
        $this->call([
            MinistrySeeder::class,
        ]);
    }
}
