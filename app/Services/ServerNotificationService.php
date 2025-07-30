<?php

namespace App\Services;

use App\Models\Server;
use App\Models\ServerNotification;
use App\Models\Schedule;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ServerNotificationService
{
    /**
     * Notificar a un servidor sobre una nueva asignación
     */
    public function notifyServerAssignment(Server $server, Schedule $schedule): ServerNotification
    {
        $notification = ServerNotification::create([
            'server_id' => $server->id,
            'schedule_id' => $schedule->id,
            'type' => ServerNotification::TYPE_ASSIGNMENT,
            'title' => 'Nueva Asignación de Servicio',
            'message' => $this->generateAssignmentMessage($server, $schedule),
            'delivery_method' => $server->preferred_contact_method,
            'data' => [
                'schedule_details' => [
                    'ministry' => $schedule->ministry->name,
                    'day_of_week' => $schedule->day_of_week,
                    'start_time' => $schedule->start_time,
                    'end_time' => $schedule->end_time,
                ]
            ]
        ]);

        $this->sendNotification($notification);

        return $notification;
    }

    /**
     * Notificar a un servidor sobre un evento específico
     */
    public function notifyServerEvent(Server $server, Event $event): ServerNotification
    {
        $notification = ServerNotification::create([
            'server_id' => $server->id,
            'event_id' => $event->id,
            'type' => ServerNotification::TYPE_ASSIGNMENT,
            'title' => 'Nueva Asignación de Evento',
            'message' => $this->generateEventMessage($server, $event),
            'delivery_method' => $server->preferred_contact_method,
            'data' => [
                'event_details' => [
                    'name' => $event->name,
                    'type' => $event->type,
                    'start_datetime' => $event->start_datetime,
                    'end_datetime' => $event->end_datetime,
                    'location' => $event->location,
                ]
            ]
        ]);

        $this->sendNotification($notification);

        return $notification;
    }

    /**
     * Enviar recordatorio antes del servicio
     */
    public function sendReminder(ServerNotification $originalNotification, int $hoursBeforeEvent = 24): ServerNotification
    {
        $reminderNotification = ServerNotification::create([
            'server_id' => $originalNotification->server_id,
            'schedule_id' => $originalNotification->schedule_id,
            'event_id' => $originalNotification->event_id,
            'type' => ServerNotification::TYPE_REMINDER,
            'title' => 'Recordatorio de Servicio',
            'message' => $this->generateReminderMessage($originalNotification),
            'delivery_method' => $originalNotification->server->preferred_contact_method,
            'scheduled_for' => now()->addHours($hoursBeforeEvent)
        ]);

        return $reminderNotification;
    }

    /**
     * Notificar a administradores sobre la respuesta de un servidor
     */
    public function notifyAdministratorsOfResponse(ServerNotification $notification): void
    {
        $administrators = User::role(['Leader', 'Manager'])->get();

        foreach ($administrators as $admin) {
            Mail::send('emails.server-response-notification', [
                'admin' => $admin,
                'notification' => $notification,
                'server' => $notification->server,
                'response' => $notification->response_status
            ], function ($message) use ($admin, $notification) {
                $message->to($admin->email)
                       ->subject("Respuesta de Servidor: {$notification->server->display_name}");
            });
        }
    }

    /**
     * Enviar la notificación según el método preferido
     */
    public function sendNotification(ServerNotification $notification): void
    {
        $server = $notification->server;

        try {
            if ($server->canReceiveEmailNotifications()) {
                $this->sendEmailNotification($notification);
            }

            if ($server->canReceiveSmsNotifications()) {
                $this->sendSmsNotification($notification);
            }

            $notification->markAsSent();

        } catch (\Exception $e) {
            Log::error('Error sending notification', [
                'notification_id' => $notification->id,
                'error' => $e->getMessage()
            ]);

            $notification->markAsFailed();
        }
    }

    /**
     * Enviar notificación por email
     */
    protected function sendEmailNotification(ServerNotification $notification): void
    {
        $server = $notification->server;
        $email = $server->contact_email;

        if (!$email) {
            throw new \Exception('No email address available for server');
        }

        Mail::send('emails.server-notification', [
            'notification' => $notification,
            'server' => $server,
            'responseUrl' => route('server.notification.respond', $notification->response_token),
            'calendarUrl' => route('server.notification.calendar', $notification->response_token),
        ], function ($message) use ($email, $notification) {
            $message->to($email)
                   ->subject($notification->title);
        });
    }

    /**
     * Enviar notificación por SMS (implementación básica)
     */
    protected function sendSmsNotification(ServerNotification $notification): void
    {
        $server = $notification->server;
        $phone = $server->contact_phone;

        if (!$phone) {
            throw new \Exception('No phone number available for server');
        }

        // Aquí integrarías con un servicio de SMS como Twilio, Nexmo, etc.
        // Por ahora solo logueamos
        Log::info('SMS notification would be sent', [
            'phone' => $phone,
            'message' => $notification->message,
            'notification_id' => $notification->id
        ]);
    }

    /**
     * Generar mensaje para asignación de horario
     */
    protected function generateAssignmentMessage(Server $server, Schedule $schedule): string
    {
        $dayTranslations = [
            'monday' => 'Lunes',
            'tuesday' => 'Martes',
            'wednesday' => 'Miércoles',
            'thursday' => 'Jueves',
            'friday' => 'Viernes',
            'saturday' => 'Sábado',
            'sunday' => 'Domingo'
        ];

        $day = $dayTranslations[$schedule->day_of_week] ?? $schedule->day_of_week;

        return "Hola {$server->display_name},\n\n" .
               "Se te ha asignado un nuevo servicio en el ministerio de {$schedule->ministry->name}.\n\n" .
               "Detalles:\n" .
               "• Día: {$day}\n" .
               "• Hora: {$schedule->start_time} - {$schedule->end_time}\n" .
               "• Posición: {$server->position}\n\n" .
               "Por favor confirma tu disponibilidad haciendo clic en el enlace de respuesta.\n\n" .
               "¡Gracias por tu servicio!";
    }

    /**
     * Generar mensaje para evento específico
     */
    protected function generateEventMessage(Server $server, Event $event): string
    {
        $eventTypes = [
            'service' => 'Servicio',
            'meeting' => 'Reunión',
            'special' => 'Evento Especial',
            'training' => 'Entrenamiento',
            'outreach' => 'Alcance'
        ];

        $eventType = $eventTypes[$event->type] ?? $event->type;
        $startDate = $event->start_datetime->format('d/m/Y H:i');
        $endDate = $event->end_datetime->format('d/m/Y H:i');

        return "Hola {$server->display_name},\n\n" .
               "Se te ha asignado para participar en el siguiente evento:\n\n" .
               "• Evento: {$event->name}\n" .
               "• Tipo: {$eventType}\n" .
               "• Inicio: {$startDate}\n" .
               "• Fin: {$endDate}\n" .
               ($event->location ? "• Ubicación: {$event->location}\n" : "") .
               "\n" .
               ($event->description ? "Descripción: {$event->description}\n\n" : "") .
               "Por favor confirma tu disponibilidad haciendo clic en el enlace de respuesta.\n\n" .
               "¡Gracias por tu servicio!";
    }

    /**
     * Generar mensaje de recordatorio
     */
    protected function generateReminderMessage(ServerNotification $originalNotification): string
    {
        if ($originalNotification->schedule) {
            return "Recordatorio: Tienes servicio mañana en {$originalNotification->schedule->ministry->name} " .
                   "de {$originalNotification->schedule->start_time} a {$originalNotification->schedule->end_time}.";
        }

        if ($originalNotification->event) {
            $event = $originalNotification->event;
            return "Recordatorio: Tienes el evento '{$event->name}' el " .
                   $event->start_datetime->format('d/m/Y') . " a las " .
                   $event->start_datetime->format('H:i') . ".";
        }

        return "Recordatorio: Tienes un servicio programado próximamente.";
    }
}
