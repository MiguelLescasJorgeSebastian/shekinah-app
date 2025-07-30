<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class CheckUserApproval
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response|InertiaResponse
    {
        $user = $request->user();

        // Si el usuario tiene rol "Pendiente", no puede acceder
        if ($user && $user->hasRole('Pendiente')) {
            return Inertia::render('auth/pending-approval', [
                'user' => $user
            ]);
        }

        return $next($request);
    }
}
