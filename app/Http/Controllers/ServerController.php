<?php

namespace App\Http\Controllers;

use App\Models\Server;
use App\Models\Ministry;
use App\Models\User;
use App\Services\ServerNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ServerController extends Controller
{
    protected $notificationService;

    public function __construct(ServerNotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!$request->user()->can('view servers')) {
            abort(403);
        }

        $servers = Server::with(['user', 'ministry', 'schedules'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('external_name', 'like', "%{$search}%")
                      ->orWhere('position', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($userQuery) use ($search) {
                          $userQuery->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('ministry', function ($ministryQuery) use ($search) {
                          $ministryQuery->where('name', 'like', "%{$search}%");
                      });
                });
            })
            ->when($request->ministry_id, function ($query, $ministryId) {
                $query->where('ministry_id', $ministryId);
            })
            ->when($request->is_external, function ($query, $isExternal) {
                $query->where('is_external', $isExternal === 'true');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        $ministries = Ministry::where('is_active', true)->get();

        return Inertia::render('Servers/Index', [
            'servers' => $servers,
            'ministries' => $ministries,
            'filters' => $request->only(['search', 'ministry_id', 'is_external']),
            'canCreate' => $request->user()->can('create servers'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        if (!$request->user()->can('create servers')) {
            abort(403);
        }

        $users = User::orderBy('name')->get();
        $ministries = Ministry::where('is_active', true)->get();

        return Inertia::render('Servers/Create', [
            'users' => $users,
            'ministries' => $ministries,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$request->user()->can('create servers')) {
            abort(403);
        }

        $validated = $request->validate([
            'ministry_id' => 'required|exists:ministries,id',
            'position' => 'required|string|max:255',
            'skills' => 'nullable|string',
            'is_external' => 'boolean',

            // Campos para servidores registrados
            'user_id' => 'nullable|exists:users,id|required_if:is_external,false',

            // Campos para servidores externos
            'external_name' => 'nullable|string|max:255|required_if:is_external,true',
            'external_email' => 'nullable|email|required_if:is_external,true',
            'external_phone' => 'nullable|string|max:20',

            // Preferencias de notificación
            'email_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'preferred_contact_method' => 'required|in:email,sms,both',

            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $validated['is_active'] = true;

        $server = Server::create($validated);

        // Enviar notificación de bienvenida
        if ($server->canReceiveEmailNotifications() || $server->canReceiveSmsNotifications()) {
            try {
                $this->sendWelcomeNotification($server);
            } catch (\Exception $e) {
                // Log error but don't fail the creation
                Log::error('Failed to send welcome notification', [
                    'server_id' => $server->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        return redirect()->route('servers.index')
                        ->with('success', 'Servidor agregado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Server $server)
    {
        if (!$request->user()->can('view servers')) {
            abort(403);
        }

        $server->load(['user', 'ministry', 'schedules.ministry', 'notifications' => function ($query) {
            $query->orderBy('created_at', 'desc')->limit(10);
        }]);

        return Inertia::render('Servers/Show', [
            'server' => $server,
            'canEdit' => $request->user()->can('edit servers'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Server $server)
    {
        if (!$request->user()->can('edit servers')) {
            abort(403);
        }

        $users = User::orderBy('name')->get();
        $ministries = Ministry::where('is_active', true)->get();

        return Inertia::render('Servers/Edit', [
            'server' => $server,
            'users' => $users,
            'ministries' => $ministries,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Server $server)
    {
        if (!$request->user()->can('edit servers')) {
            abort(403);
        }

        $validated = $request->validate([
            'ministry_id' => 'required|exists:ministries,id',
            'position' => 'required|string|max:255',
            'skills' => 'nullable|string',
            'is_external' => 'boolean',

            // Campos para servidores registrados
            'user_id' => 'nullable|exists:users,id|required_if:is_external,false',

            // Campos para servidores externos
            'external_name' => 'nullable|string|max:255|required_if:is_external,true',
            'external_email' => 'nullable|email|required_if:is_external,true',
            'external_phone' => 'nullable|string|max:20',

            // Preferencias de notificación
            'email_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'preferred_contact_method' => 'required|in:email,sms,both',

            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_active' => 'boolean',
        ]);

        $server->update($validated);

        return redirect()->route('servers.index')
                        ->with('success', 'Servidor actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Server $server)
    {
        if (!$request->user()->can('delete servers')) {
            abort(403);
        }

        $server->update(['is_active' => false]);

        return redirect()->route('servers.index')
                        ->with('success', 'Servidor desactivado exitosamente.');
    }

    /**
     * Enviar notificación de bienvenida a nuevo servidor
     */
    protected function sendWelcomeNotification(Server $server)
    {
        $message = "¡Bienvenido al equipo de {$server->ministry->name}!\n\n";
        $message .= "Hemos registrado tu información como servidor en nuestra iglesia.\n";
        $message .= "Tu posición: {$server->position}\n\n";
        $message .= "Recibirás notificaciones cuando se te asigne a servicios o eventos.\n";
        $message .= "Siempre podrás confirmar tu disponibilidad a través de los enlaces que te enviaremos.\n\n";
        $message .= "¡Gracias por tu corazón de servicio!";

        $notification = $server->notifications()->create([
            'type' => 'welcome',
            'title' => 'Bienvenido al Equipo de Ministerio',
            'message' => $message,
            'delivery_method' => $server->preferred_contact_method,
            'status' => 'pending'
        ]);

        $this->notificationService->sendNotification($notification);
    }
}
