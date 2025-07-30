<?php

namespace App\Http\Controllers;

use App\Models\ServerNotification;
use App\Services\ServerNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;

class ServerNotificationController extends Controller
{
    protected $notificationService;

    public function __construct(ServerNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Página de respuesta para servidores (no requiere login)
     */
    public function respond(Request $request, string $token)
    {
        $notification = ServerNotification::where('response_token', $token)->firstOrFail();

        // Marcar como leída
        $notification->markAsRead();

        return Inertia::render('Server/NotificationResponse', [
            'notification' => $notification->load(['server', 'schedule.ministry', 'event']),
            'token' => $token,
        ]);
    }

    /**
     * Procesar respuesta del servidor
     */
    public function processResponse(Request $request, string $token)
    {
        $request->validate([
            'action' => 'required|in:confirmed,declined,maybe',
            'message' => 'nullable|string|max:500'
        ]);

        $notification = ServerNotification::where('response_token', $token)->firstOrFail();

        $notification->recordResponse(
            $request->input('action'),
            $request->input('message')
        );

        // Notificar a los administradores sobre la respuesta
        $this->notificationService->notifyAdministratorsOfResponse($notification);

        return redirect()->back()->with('success',
            $this->getResponseMessage($request->input('action'))
        );
    }

    /**
     * Generar archivo ICS para añadir al calendario
     */
    public function addToCalendar(Request $request, string $token)
    {
        $notification = ServerNotification::where('response_token', $token)->firstOrFail();

        if (!$notification->schedule && !$notification->event) {
            abort(404, 'No hay evento o horario asociado');
        }

        $icsContent = $this->generateICSContent($notification);

        return Response::make($icsContent, 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="evento-ministerio.ics"',
        ]);
    }

    /**
     * Redirigir a Google Calendar
     */
    public function addToGoogleCalendar(Request $request, string $token)
    {
        $notification = ServerNotification::where('response_token', $token)->firstOrFail();

        $calendarData = $this->getCalendarData($notification);

        $googleUrl = 'https://calendar.google.com/calendar/render?' . http_build_query([
            'action' => 'TEMPLATE',
            'text' => $calendarData['title'],
            'dates' => $calendarData['dates'],
            'details' => $calendarData['description'],
            'location' => $calendarData['location'],
        ]);

        return redirect($googleUrl);
    }

    /**
     * Redirigir a Outlook Calendar
     */
    public function addToOutlookCalendar(Request $request, string $token)
    {
        $notification = ServerNotification::where('response_token', $token)->firstOrFail();

        $calendarData = $this->getCalendarData($notification);

        $outlookUrl = 'https://outlook.live.com/calendar/0/deeplink/compose?' . http_build_query([
            'subject' => $calendarData['title'],
            'startdt' => $calendarData['start_iso'],
            'enddt' => $calendarData['end_iso'],
            'body' => $calendarData['description'],
            'location' => $calendarData['location'],
        ]);

        return redirect($outlookUrl);
    }

    private function getResponseMessage(string $action): string
    {
        return match($action) {
            'confirmed' => '¡Gracias por confirmar tu participación!',
            'declined' => 'Tu respuesta ha sido registrada. Buscaremos un reemplazo.',
            'maybe' => 'Tu respuesta ha sido registrada. Te contactaremos pronto.',
            default => 'Tu respuesta ha sido registrada.'
        };
    }

    private function generateICSContent(ServerNotification $notification): string
    {
        $event = $notification->event;
        $schedule = $notification->schedule;
        $server = $notification->server;

        if ($event) {
            $startDate = $event->start_datetime;
            $endDate = $event->end_datetime;
            $title = $event->name;
            $description = $event->description ?? '';
            $location = $event->location ?? '';
        } elseif ($schedule) {
            // Para horarios recurrentes, crear evento para la próxima fecha
            $startDate = $this->getNextScheduleDate($schedule);
            $endDate = $startDate->copy()->setTimeFromTimeString($schedule->end_time);
            $startDate->setTimeFromTimeString($schedule->start_time);
            $title = "Servicio - {$schedule->ministry->name}";
            $description = "Ministerio: {$schedule->ministry->name}\nPosición: {$server->position}";
            $location = 'Iglesia';
        } else {
            abort(404);
        }

        $uid = 'notification-' . $notification->id . '@' . request()->getHost();
        $dtstamp = now()->format('Ymd\THis\Z');
        $dtstart = $startDate->format('Ymd\THis\Z');
        $dtend = $endDate->format('Ymd\THis\Z');

        return "BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Iglesia App//Server Notification//ES
BEGIN:VEVENT
UID:{$uid}
DTSTAMP:{$dtstamp}
DTSTART:{$dtstart}
DTEND:{$dtend}
SUMMARY:{$title}
DESCRIPTION:{$description}
LOCATION:{$location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR";
    }

    private function getNextScheduleDate($schedule)
    {
        $today = now();
        $dayOfWeek = $schedule->day_of_week;

        $daysOfWeek = [
            'monday' => 1,
            'tuesday' => 2,
            'wednesday' => 3,
            'thursday' => 4,
            'friday' => 5,
            'saturday' => 6,
            'sunday' => 0,
        ];

        $targetDay = $daysOfWeek[$dayOfWeek];
        $currentDay = $today->dayOfWeek;

        if ($currentDay <= $targetDay) {
            $daysToAdd = $targetDay - $currentDay;
        } else {
            $daysToAdd = 7 - ($currentDay - $targetDay);
        }

        return $today->addDays($daysToAdd);
    }

    private function getCalendarData(ServerNotification $notification): array
    {
        $event = $notification->event;
        $schedule = $notification->schedule;
        $server = $notification->server;

        if ($event) {
            $startDate = $event->start_datetime;
            $endDate = $event->end_datetime;
            $title = $event->name;
            $description = $event->description ?? '';
            $location = $event->location ?? '';
        } elseif ($schedule) {
            // Para horarios recurrentes, crear evento para la próxima fecha
            $startDate = $this->getNextScheduleDate($schedule);
            $endDate = $startDate->copy()->setTimeFromTimeString($schedule->end_time);
            $startDate->setTimeFromTimeString($schedule->start_time);
            $title = "Servicio - {$schedule->ministry->name}";
            $description = "Ministerio: {$schedule->ministry->name}\nPosición: {$server->position}";
            $location = 'Iglesia';
        } else {
            abort(404);
        }

        return [
            'title' => $title,
            'description' => $description,
            'location' => $location,
            'start_iso' => $startDate->format('Y-m-d\TH:i:s'),
            'end_iso' => $endDate->format('Y-m-d\TH:i:s'),
            'dates' => $startDate->format('Ymd\THis') . '/' . $endDate->format('Ymd\THis'),
        ];
    }
}
