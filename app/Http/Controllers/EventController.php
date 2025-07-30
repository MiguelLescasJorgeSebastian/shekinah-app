<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ministry;
use App\Models\Schedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->can('view events')) {
            abort(403);
        }

        $query = Event::with(['creator', 'schedules.ministry', 'schedules.server.user'])
                     ->orderBy('start_datetime', 'desc');

        // Filtros por rol
        if ($user->hasRole('Líder de Ministerio') && !$user->hasAnyRole(['Pastor', 'Líder de Iglesia'])) {
            $userMinistriesIds = $user->leadingMinistries()->pluck('id');
            $query->where(function ($q) use ($user, $userMinistriesIds) {
                $q->where('created_by', $user->id)
                  ->orWhereJsonContains('required_ministries', $userMinistriesIds->toArray());
            });
        }

        // Filtros por búsqueda
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%')
                  ->orWhere('location', 'like', '%' . $request->search . '%');
            });
        }

        // Filtros por tipo
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filtros por estado
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $events = $query->get();

        return Inertia::render('Events/Index', [
            'events' => $events,
            'filters' => $request->only(['search', 'type', 'status']),
            'canCreate' => $user->can('create events'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        if (!$request->user()->can('create events')) {
            abort(403);
        }

        $ministries = Ministry::where('is_active', true)->get();

        return Inertia::render('Events/Create', [
            'ministries' => $ministries,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$request->user()->can('create events')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:service,meeting,special,training,outreach',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'location' => 'nullable|string|max:255',
            'required_ministries' => 'nullable|array',
            'required_ministries.*' => 'exists:ministries,id',
            'is_recurring' => 'boolean',
            'recurrence_type' => 'nullable|in:daily,weekly,biweekly,monthly',
            'recurrence_config' => 'nullable|array',
            'recurrence_end_date' => 'nullable|date|after:start_datetime',
        ]);

        $validated['created_by'] = $request->user()->id;

        $event = Event::create($validated);

        // Generar instancias recurrentes si es necesario
        if ($event->is_recurring && $event->recurrence_type) {
            $event->generateRecurringInstances();
        }

        return redirect()->route('events.index')
                        ->with('success', 'Evento creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Event $event)
    {
        if (!$request->user()->can('view events')) {
            abort(403);
        }

        $event->load(['creator', 'schedules.ministry', 'schedules.server.user']);

        return Inertia::render('Events/Show', [
            'event' => $event,
            'canEdit' => $request->user()->can('edit events'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Event $event)
    {
        if (!$request->user()->can('edit events')) {
            abort(403);
        }

        $ministries = Ministry::where('is_active', true)->get();

        return Inertia::render('Events/Edit', [
            'event' => $event,
            'ministries' => $ministries,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        if (!$request->user()->can('edit events')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:service,meeting,special,training,outreach',
            'start_datetime' => 'required|date',
            'end_datetime' => 'required|date|after:start_datetime',
            'location' => 'nullable|string|max:255',
            'required_ministries' => 'nullable|array',
            'required_ministries.*' => 'exists:ministries,id',
            'status' => 'required|in:planned,confirmed,cancelled,completed',
        ]);

        $event->update($validated);

        return redirect()->route('events.index')
                        ->with('success', 'Evento actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Event $event)
    {
        if (!$request->user()->can('delete events')) {
            abort(403);
        }

        $event->update(['status' => 'cancelled']);

        return redirect()->route('events.index')
                        ->with('success', 'Evento cancelado exitosamente.');
    }

    /**
     * Asignar horario a un evento
     */
    public function assignSchedule(Request $request, Event $event)
    {
        if (!$request->user()->can('manage event schedules')) {
            abort(403);
        }

        $validated = $request->validate([
            'ministry_id' => 'required|exists:ministries,id',
            'server_id' => 'nullable|exists:servers,id',
            'day_of_week' => 'required|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'notes' => 'nullable|string',
        ]);

        Schedule::create([
            'event_id' => $event->id,
            'ministry_id' => $validated['ministry_id'],
            'server_id' => $validated['server_id'],
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'notes' => $validated['notes'],
            'status' => 'assigned',
        ]);

        return redirect()->route('events.show', $event)
                        ->with('success', 'Horario asignado exitosamente.');
    }
}
