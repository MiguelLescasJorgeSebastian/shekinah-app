<?php

namespace Database\Seeders;

use App\Models\Ministry;
use App\Models\Server;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MinistrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener usuarios para asignar como líderes
        $users = User::all();
        $admin = $users->where('email', 'admin@iglesia.com')->first();
        $manager = $users->where('email', 'encargado@iglesia.com')->first();

        // Crear ministerios principales
        $worship = Ministry::create([
            'name' => 'Alabanza y Adoración',
            'description' => 'Ministerio encargado de la música y adoración en los servicios',
            'color' => '#3B82F6', // Azul
            'leader_id' => $manager->id,
            'is_active' => true,
        ]);

        $media = Ministry::create([
            'name' => 'Medios Audiovisuales',
            'description' => 'Sonido, video, streaming y tecnología',
            'color' => '#10B981', // Verde
            'leader_id' => $admin->id,
            'is_active' => true,
        ]);

        $evangelism = Ministry::create([
            'name' => 'Evangelismo',
            'description' => 'Evangelización y misiones',
            'color' => '#F59E0B', // Amarillo
            'leader_id' => $users->where('name', '!=', 'Administrador')->where('name', '!=', 'Encargado de Prueba')->first()->id,
            'is_active' => true,
        ]);

        $youth = Ministry::create([
            'name' => 'Jóvenes',
            'description' => 'Ministerio de jóvenes y adolescentes',
            'color' => '#8B5CF6', // Púrpura
            'leader_id' => $users->skip(3)->first()->id,
            'is_active' => true,
        ]);

        $children = Ministry::create([
            'name' => 'Niños',
            'description' => 'Ministerio infantil y escuela dominical',
            'color' => '#EC4899', // Rosa
            'leader_id' => $users->skip(4)->first()->id,
            'is_active' => true,
        ]);

        // Crear sub-ministerios
        $instruments = Ministry::create([
            'name' => 'Instrumentos',
            'description' => 'Guitarras, bajo, batería, piano',
            'color' => '#1E40AF', // Azul más oscuro
            'parent_ministry_id' => $worship->id,
            'is_active' => true,
        ]);

        $vocals = Ministry::create([
            'name' => 'Coros',
            'description' => 'Vocalistas y coros',
            'color' => '#1D4ED8', // Azul medio
            'parent_ministry_id' => $worship->id,
            'is_active' => true,
        ]);

        $sound = Ministry::create([
            'name' => 'Sonido',
            'description' => 'Operadores de audio y sonido',
            'color' => '#059669', // Verde más oscuro
            'parent_ministry_id' => $media->id,
            'is_active' => true,
        ]);

        $video = Ministry::create([
            'name' => 'Video y Streaming',
            'description' => 'Cámaras, streaming y producción de video',
            'color' => '#047857', // Verde oscuro
            'parent_ministry_id' => $media->id,
            'is_active' => true,
        ]);

        // Asignar servidores a los ministerios
        $serverUsers = $users->skip(2); // Saltar admin y manager

        // Servidores para Alabanza
        foreach ($serverUsers->take(3) as $index => $user) {
            Server::create([
                'user_id' => $user->id,
                'ministry_id' => $worship->id,
                'position' => ['Director Musical', 'Pianista', 'Vocalista'][$index] ?? 'Músico',
                'skills' => ['Dirección musical, Piano', 'Piano, Teclados', 'Canto, Armonías'][$index] ?? 'Música',
                'start_date' => now()->subMonths(rand(1, 12)),
                'is_active' => true,
            ]);
        }

        // Servidores para Medios
        foreach ($serverUsers->skip(3)->take(2) as $index => $user) {
            Server::create([
                'user_id' => $user->id,
                'ministry_id' => $media->id,
                'position' => ['Ingeniero de Sonido', 'Operador de Cámara'][$index] ?? 'Técnico',
                'skills' => ['Audio, Mezcla, Equipos de sonido', 'Video, Streaming, Producción'][$index] ?? 'Técnico',
                'start_date' => now()->subMonths(rand(1, 6)),
                'is_active' => true,
            ]);
        }

        // Crear algunos eventos de ejemplo
        Event::create([
            'name' => 'Servicio Dominical Matutino',
            'description' => 'Servicio principal de los domingos por la mañana',
            'type' => 'service',
            'start_datetime' => now()->next('Sunday')->setTime(9, 0),
            'end_datetime' => now()->next('Sunday')->setTime(11, 0),
            'location' => 'Santuario Principal',
            'required_ministries' => [$worship->id, $media->id],
            'status' => 'confirmed',
            'created_by' => $admin->id,
        ]);

        Event::create([
            'name' => 'Reunión de Jóvenes',
            'description' => 'Reunión semanal del ministerio de jóvenes',
            'type' => 'meeting',
            'start_datetime' => now()->next('Friday')->setTime(19, 30),
            'end_datetime' => now()->next('Friday')->setTime(21, 30),
            'location' => 'Salón de Jóvenes',
            'required_ministries' => [$youth->id, $media->id],
            'status' => 'planned',
            'created_by' => $admin->id,
        ]);

        Event::create([
            'name' => 'Concierto de Alabanza',
            'description' => 'Concierto especial de alabanza y adoración',
            'type' => 'special',
            'start_datetime' => now()->addWeek()->setTime(19, 0),
            'end_datetime' => now()->addWeek()->setTime(21, 0),
            'location' => 'Santuario Principal',
            'required_ministries' => [$worship->id, $media->id],
            'status' => 'planned',
            'created_by' => $manager->id,
        ]);
    }
}
