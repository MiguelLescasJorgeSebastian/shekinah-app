<?php

namespace Database\Seeders;

use App\Models\Server;
use App\Models\Ministry;
use App\Models\Schedule;
use App\Models\Event;
use App\Services\ServerNotificationService;
use Illuminate\Database\Seeder;

class ServerNotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notificationService = app(ServerNotificationService::class);

        // Crear algunos servidores externos de ejemplo
        $ministryMusic = Ministry::where('name', 'like', '%Música%')->first() ??
                        Ministry::where('name', 'like', '%Alabanza%')->first() ??
                        Ministry::first();

        $ministryUshers = Ministry::where('name', 'like', '%Ujier%')->first() ??
                         Ministry::skip(1)->first() ??
                         Ministry::first();

        if (!$ministryMusic || !$ministryUshers) {
            $this->command->error('No se encontraron ministerios. Ejecuta primero el DatabaseSeeder.');
            return;
        }

        // Servidor externo 1 - Músico
        $externalServer1 = Server::create([
            'ministry_id' => $ministryMusic->id,
            'position' => 'Guitarrista',
            'skills' => 'Guitarra acústica y eléctrica, 5 años de experiencia',
            'is_external' => true,
            'external_name' => 'Carlos Mendoza',
            'external_email' => 'carlos.mendoza@email.com',
            'external_phone' => '+1 234 567 8901',
            'email_notifications' => true,
            'sms_notifications' => false,
            'preferred_contact_method' => 'email',
            'is_active' => true,
        ]);

        // Servidor externo 2 - Ujier
        $externalServer2 = Server::create([
            'ministry_id' => $ministryUshers->id,
            'position' => 'Ujier Principal',
            'skills' => 'Coordinación de equipos, experiencia en logística',
            'is_external' => true,
            'external_name' => 'María González',
            'external_email' => 'maria.gonzalez@email.com',
            'external_phone' => '+1 234 567 8902',
            'email_notifications' => true,
            'sms_notifications' => true,
            'preferred_contact_method' => 'both',
            'is_active' => true,
        ]);

        // Servidor externo 3 - Vocalista
        $externalServer3 = Server::create([
            'ministry_id' => $ministryMusic->id,
            'position' => 'Vocalista',
            'skills' => 'Soprano, dirección coral',
            'is_external' => true,
            'external_name' => 'Ana Patricia Ruiz',
            'external_email' => 'ana.ruiz@email.com',
            'external_phone' => '+1 234 567 8903',
            'email_notifications' => true,
            'sms_notifications' => false,
            'preferred_contact_method' => 'email',
            'is_active' => true,
        ]);

        $this->command->info('✅ Servidores externos creados:');
        $this->command->line("   • {$externalServer1->display_name} - {$externalServer1->position}");
        $this->command->line("   • {$externalServer2->display_name} - {$externalServer2->position}");
        $this->command->line("   • {$externalServer3->display_name} - {$externalServer3->position}");

        // Crear eventos de ejemplo
        $eventSunday = Event::create([
            'name' => 'Servicio Dominical',
            'description' => 'Servicio principal de adoración dominical',
            'type' => 'service',
            'start_datetime' => now()->next('Sunday')->setTime(9, 0),
            'end_datetime' => now()->next('Sunday')->setTime(11, 30),
            'location' => 'Santuario Principal',
            'status' => 'confirmed',
            'created_by' => 1, // Usuario admin
        ]);

        $eventWednesday = Event::create([
            'name' => 'Ensayo Musical',
            'description' => 'Ensayo semanal del equipo de música',
            'type' => 'training',
            'start_datetime' => now()->next('Wednesday')->setTime(19, 0),
            'end_datetime' => now()->next('Wednesday')->setTime(21, 0),
            'location' => 'Salón de Música',
            'status' => 'confirmed',
            'created_by' => 1, // Usuario admin
        ]);

        // Crear horarios de ejemplo
        $schedule1 = Schedule::create([
            'event_id' => $eventSunday->id,
            'ministry_id' => $ministryMusic->id,
            'server_id' => $externalServer1->id,
            'day_of_week' => 'sunday',
            'start_time' => '09:00',
            'end_time' => '11:30',
            'notes' => 'Servicio dominical matutino',
            'status' => 'assigned',
        ]);

        $schedule2 = Schedule::create([
            'event_id' => $eventSunday->id,
            'ministry_id' => $ministryUshers->id,
            'server_id' => $externalServer2->id,
            'day_of_week' => 'sunday',
            'start_time' => '08:30',
            'end_time' => '12:00',
            'notes' => 'Coordinación de entrada y salida',
            'status' => 'assigned',
        ]);

        $schedule3 = Schedule::create([
            'event_id' => $eventWednesday->id,
            'ministry_id' => $ministryMusic->id,
            'server_id' => $externalServer3->id,
            'day_of_week' => 'wednesday',
            'start_time' => '19:00',
            'end_time' => '21:00',
            'notes' => 'Ensayo semanal',
            'status' => 'assigned',
        ]);

        $this->command->info('📅 Eventos y horarios creados:');
        $this->command->line("   • {$eventSunday->name}: Domingo 09:00-11:30");
        $this->command->line("   • {$eventWednesday->name}: Miércoles 19:00-21:00");

        // Crear evento especial
        $specialEvent = Event::create([
            'name' => 'Concierto de Navidad',
            'description' => 'Presentación especial navideña con coro e instrumentos',
            'type' => 'special',
            'start_datetime' => now()->addDays(14)->setTime(19, 0),
            'end_datetime' => now()->addDays(14)->setTime(21, 30),
            'location' => 'Santuario Principal',
            'status' => 'planned',
            'created_by' => 1, // Usuario admin
        ]);

        $this->command->info("🎉 Evento creado: {$specialEvent->name}");

        // Enviar notificaciones de asignación
        $this->command->info('📧 Enviando notificaciones...');

        try {
            $notification1 = $notificationService->notifyServerAssignment($externalServer1, $schedule1);
            $this->command->line("   ✅ Notificación enviada a {$externalServer1->display_name}");
            $this->command->line("      Token: {$notification1->response_token}");
            $this->command->line("      URL: " . url("/server/notification/{$notification1->response_token}"));

            $notification2 = $notificationService->notifyServerAssignment($externalServer2, $schedule2);
            $this->command->line("   ✅ Notificación enviada a {$externalServer2->display_name}");
            $this->command->line("      Token: {$notification2->response_token}");
            $this->command->line("      URL: " . url("/server/notification/{$notification2->response_token}"));

            $notification3 = $notificationService->notifyServerEvent($externalServer3, $specialEvent);
            $this->command->line("   ✅ Notificación de evento enviada a {$externalServer3->display_name}");
            $this->command->line("      Token: {$notification3->response_token}");
            $this->command->line("      URL: " . url("/server/notification/{$notification3->response_token}"));

        } catch (\Exception $e) {
            $this->command->error("❌ Error enviando notificaciones: {$e->getMessage()}");
        }

        $this->command->info('');
        $this->command->info('🎯 Sistema de notificaciones configurado exitosamente!');
        $this->command->info('');
        $this->command->info('📋 Resumen de URLs para pruebas:');

        $allNotifications = \App\Models\ServerNotification::orderBy('created_at', 'desc')->limit(3)->get();
        foreach ($allNotifications as $notification) {
            $this->command->line("   • {$notification->server->display_name}: " . url("/server/notification/{$notification->response_token}"));
        }

        $this->command->info('');
        $this->command->info('🔗 Funcionalidades disponibles:');
        $this->command->line('   • Los servidores pueden confirmar/declinar sin login');
        $this->command->line('   • Botón para agregar eventos al calendario');
        $this->command->line('   • Notificaciones por email automáticas');
        $this->command->line('   • Sistema de recordatorios programables');
        $this->command->line('   • Respuestas trackeable para administradores');
    }
}
