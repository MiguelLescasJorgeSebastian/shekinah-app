<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MinistryController;
use App\Http\Controllers\ServerController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', \App\Http\Middleware\CheckUserApproval::class])->group(function () {
    // Dashboard principal
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas de Ministerios
    Route::resource('ministries', MinistryController::class);

    // Rutas de Servidores
    Route::resource('servers', ServerController::class);

    // Rutas de Eventos
    Route::resource('events', EventController::class);

    // Rutas de Documentos
    Route::resource('documents', DocumentController::class);
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    // Rutas de Usuarios
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.assign-role');
    Route::post('users/{user}/change-role', [UserController::class, 'changeRole'])->name('users.change-role');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Rutas adicionales para asignaciones
    Route::post('ministries/{ministry}/assign-server', [MinistryController::class, 'assignServer'])
        ->name('ministries.assign-server');

    Route::post('events/{event}/assign-schedule', [EventController::class, 'assignSchedule'])
        ->name('events.assign-schedule');
});

// Rutas públicas para servidores (no requieren autenticación)
Route::prefix('server')->name('server.')->group(function () {
    Route::get('notification/{token}', [App\Http\Controllers\ServerNotificationController::class, 'respond'])
        ->name('notification.respond');

    Route::post('notification/{token}/respond', [App\Http\Controllers\ServerNotificationController::class, 'processResponse'])
        ->name('notification.respond.process');

    Route::get('notification/{token}/calendar', [App\Http\Controllers\ServerNotificationController::class, 'addToCalendar'])
        ->name('notification.calendar');

    Route::get('notification/{token}/google-calendar', [App\Http\Controllers\ServerNotificationController::class, 'addToGoogleCalendar'])
        ->name('notification.google-calendar');

    Route::get('notification/{token}/outlook-calendar', [App\Http\Controllers\ServerNotificationController::class, 'addToOutlookCalendar'])
        ->name('notification.outlook-calendar');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
