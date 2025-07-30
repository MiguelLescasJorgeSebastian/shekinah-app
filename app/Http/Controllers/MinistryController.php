<?php

namespace App\Http\Controllers;

use App\Models\Ministry;
use App\Models\Server;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MinistryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Verificar permisos
        if (!$user->can('view ministries')) {
            abort(403);
        }

        $query = Ministry::with(['leader', 'parentMinistry', 'childMinistries', 'servers.user']);

        // Si es Líder de Ministerio, solo ver sus ministerios
        if ($user->hasRole('Líder de Ministerio') && !$user->hasAnyRole(['Pastor', 'Líder de Iglesia'])) {
            $query->where('leader_id', $user->id)
                  ->orWhereHas('servers', function ($q) use ($user) {
                      $q->where('user_id', $user->id);
                  });
        }

        $ministries = $query->where('is_active', true)->get();

        // Asegurar que las relaciones estén inicializadas
        $ministries->each(function ($ministry) {
            if (!$ministry->relationLoaded('childMinistries')) {
                $ministry->load('childMinistries');
            }
            if (!$ministry->relationLoaded('servers')) {
                $ministry->load('servers.user');
            }
        });

        return Inertia::render('Ministries/Index', [
            'ministries' => $ministries,
            'canCreate' => $user->can('create ministries'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        if (!$request->user()->can('create ministries')) {
            abort(403);
        }

        $users = User::all();
        $parentMinistries = Ministry::where('is_active', true)->get();

        return Inertia::render('Ministries/Create', [
            'users' => $users,
            'parentMinistries' => $parentMinistries,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$request->user()->can('create ministries')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'leader_id' => 'nullable|exists:users,id',
            'parent_ministry_id' => 'nullable|exists:ministries,id',
        ]);

        Ministry::create($validated);

        return redirect()->route('ministries.index')
                        ->with('success', 'Ministerio creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Ministry $ministry)
    {
        if (!$request->user()->can('view ministries')) {
            abort(403);
        }

        $ministry->load(['leader', 'parentMinistry', 'childMinistries', 'servers.user', 'resources']);

        return Inertia::render('Ministries/Show', [
            'ministry' => $ministry,
            'canEdit' => $request->user()->can('edit ministries'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, Ministry $ministry)
    {
        if (!$request->user()->can('edit ministries')) {
            abort(403);
        }

        $users = User::all();
        $parentMinistries = Ministry::where('is_active', true)
                                  ->where('id', '!=', $ministry->id)
                                  ->get();

        return Inertia::render('Ministries/Edit', [
            'ministry' => $ministry,
            'users' => $users,
            'parentMinistries' => $parentMinistries,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ministry $ministry)
    {
        if (!$request->user()->can('edit ministries')) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'leader_id' => 'nullable|exists:users,id',
            'parent_ministry_id' => 'nullable|exists:ministries,id',
            'is_active' => 'boolean',
        ]);

        $ministry->update($validated);

        return redirect()->route('ministries.index')
                        ->with('success', 'Ministerio actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Ministry $ministry)
    {
        if (!$request->user()->can('delete ministries')) {
            abort(403);
        }

        $ministry->update(['is_active' => false]);

        return redirect()->route('ministries.index')
                        ->with('success', 'Ministerio desactivado exitosamente.');
    }

    /**
     * Asignar un servidor a un ministerio
     */
    public function assignServer(Request $request, Ministry $ministry)
    {
        if (!$request->user()->can('manage ministry servers')) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'position' => 'nullable|string|max:255',
            'skills' => 'nullable|string',
            'start_date' => 'required|date',
        ]);

        Server::create([
            'ministry_id' => $ministry->id,
            'user_id' => $validated['user_id'],
            'position' => $validated['position'],
            'skills' => $validated['skills'],
            'start_date' => $validated['start_date'],
            'is_active' => true,
        ]);

        return redirect()->route('ministries.show', $ministry)
                        ->with('success', 'Servidor asignado exitosamente.');
    }
}
