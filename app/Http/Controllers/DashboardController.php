<?php

namespace App\Http\Controllers;

use App\Models\Ministry;
use App\Models\Server;
use App\Models\Event;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Estadísticas generales
        $stats = [
            'total_ministries' => Ministry::where('is_active', true)->count(),
            'total_servers' => Server::where('is_active', true)->count(),
            'upcoming_events' => Event::where('start_datetime', '>', now())
                ->where('status', '!=', 'cancelled')
                ->count(),
            'this_week_schedules' => Schedule::whereHas('event', function ($query) {
                $query->whereBetween('start_datetime', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ]);
            })->count(),
        ];

        // Eventos próximos
        $upcomingEvents = Event::with(['creator', 'schedules.ministry'])
            ->where('start_datetime', '>', now())
            ->where('status', '!=', 'cancelled')
            ->orderBy('start_datetime')
            ->limit(5)
            ->get();

        // Ministerios del usuario (si es líder o servidor)
        $userMinistries = collect();
        if ($user->hasRole(['Leader', 'Manager'])) {
            $userMinistries = $user->leadingMinistries()
                ->with(['servers.user', 'childMinistries'])
                ->get();
        }

        // Servidores activos en ministerios del usuario
        $userServers = collect();
        if ($user->hasRole(['Leader', 'Manager'])) {
            $userServers = Server::with(['user', 'ministry'])
                ->whereIn('ministry_id', $userMinistries->pluck('id'))
                ->where('is_active', true)
                ->get();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'upcomingEvents' => $upcomingEvents,
            'userMinistries' => $userMinistries,
            'userServers' => $userServers,
            'userRole' => $user->getRoleNames()->first(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }
}
