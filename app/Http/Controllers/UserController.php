<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Mostrar lista de usuarios
     */
    public function index()
    {
        $users = User::with('roles')->get();
        $pendingUsers = User::doesntHave('roles')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'pendingUsers' => $pendingUsers,
            'roles' => Role::all(),
        ]);
    }

    /**
     * Asignar rol a usuario
     */
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name'
        ]);

        $user->assignRole($request->role);

        return redirect()->back()->with('success', 'Rol asignado correctamente');
    }

    /**
     * Cambiar rol de usuario
     */
    public function changeRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|exists:roles,name'
        ]);

        $user->syncRoles([$request->role]);

        return redirect()->back()->with('success', 'Rol actualizado correctamente');
    }

    /**
     * Eliminar usuario
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'Usuario eliminado correctamente');
    }
}
