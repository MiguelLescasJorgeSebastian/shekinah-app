<?php

namespace App\Console\Commands;

use App\Models\ServerNotification;
use App\Services\ServerNotificationService;
use Illuminate\Console\Command;

class SendServerNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'servers:send-notifications
                            {--reminders : Send reminder notifications}
                            {--pending : Send pending notifications}
                            {--all : Send all types of notifications}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to servers about their assignments and reminders';

    protected $notificationService;

    public function __construct(ServerNotificationService $notificationService)
    {
        parent::__construct();
        $this->notificationService = $notificationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔔 Iniciando envío de notificaciones a servidores...');

        $totalSent = 0;

        if ($this->option('pending') || $this->option('all')) {
            $totalSent += $this->sendPendingNotifications();
        }

        if ($this->option('reminders') || $this->option('all')) {
            $totalSent += $this->sendScheduledNotifications();
        }

        $this->info("✅ Proceso completado. {$totalSent} notificaciones enviadas.");

        return Command::SUCCESS;
    }

    /**
     * Enviar notificaciones pendientes
     */
    protected function sendPendingNotifications(): int
    {
        $pendingNotifications = ServerNotification::where('status', ServerNotification::STATUS_PENDING)
            ->whereNull('scheduled_for')
            ->with(['server'])
            ->get();

        $sent = 0;

        foreach ($pendingNotifications as $notification) {
            try {
                $this->notificationService->sendNotification($notification);
                $sent++;
                $this->line("📧 Enviada notificación a {$notification->server->display_name}");
            } catch (\Exception $e) {
                $this->error("❌ Error enviando a {$notification->server->display_name}: {$e->getMessage()}");
            }
        }

        $this->info("📤 {$sent} notificaciones pendientes enviadas.");
        return $sent;
    }

    /**
     * Enviar notificaciones programadas
     */
    protected function sendScheduledNotifications(): int
    {
        $scheduledNotifications = ServerNotification::where('status', ServerNotification::STATUS_PENDING)
            ->where('scheduled_for', '<=', now())
            ->with(['server'])
            ->get();

        $sent = 0;

        foreach ($scheduledNotifications as $notification) {
            try {
                $this->notificationService->sendNotification($notification);
                $sent++;
                $this->line("⏰ Enviada notificación programada a {$notification->server->display_name}");
            } catch (\Exception $e) {
                $this->error("❌ Error enviando recordatorio a {$notification->server->display_name}: {$e->getMessage()}");
            }
        }

        $this->info("⏰ {$sent} recordatorios enviados.");
        return $sent;
    }
}
