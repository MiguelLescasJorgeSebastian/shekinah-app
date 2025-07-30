<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $notification->title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #3B82F6;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8f9fa;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 10px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            min-width: 120px;
        }
        .btn-confirm {
            background-color: #10B981;
            color: white;
        }
        .btn-decline {
            background-color: #EF4444;
            color: white;
        }
        .btn-maybe {
            background-color: #F59E0B;
            color: white;
        }
        .btn-calendar {
            background-color: #6B7280;
            color: white;
        }
        .details-box {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $notification->title }}</h1>
    </div>

    <div class="content">
        <p>Hola {{ $server->display_name }},</p>

        <div style="white-space: pre-line;">{{ $notification->message }}</div>

        @if($notification->schedule)
            <div class="details-box">
                <h3>📅 Detalles del Servicio</h3>
                <p><strong>Ministerio:</strong> {{ $notification->schedule->ministry->name }}</p>
                <p><strong>Día:</strong> {{ ucfirst($notification->schedule->day_of_week) }}</p>
                <p><strong>Horario:</strong> {{ $notification->schedule->start_time }} - {{ $notification->schedule->end_time }}</p>
                @if($server->position)
                    <p><strong>Tu posición:</strong> {{ $server->position }}</p>
                @endif
                @if($notification->schedule->notes)
                    <p><strong>Notas:</strong> {{ $notification->schedule->notes }}</p>
                @endif
            </div>
        @endif

        @if($notification->event)
            <div class="details-box">
                <h3>🎉 Detalles del Evento</h3>
                <p><strong>Evento:</strong> {{ $notification->event->name }}</p>
                <p><strong>Tipo:</strong> {{ ucfirst($notification->event->type) }}</p>
                <p><strong>Inicio:</strong> {{ $notification->event->start_datetime->format('d/m/Y H:i') }}</p>
                <p><strong>Fin:</strong> {{ $notification->event->end_datetime->format('d/m/Y H:i') }}</p>
                @if($notification->event->location)
                    <p><strong>Ubicación:</strong> {{ $notification->event->location }}</p>
                @endif
                @if($notification->event->description)
                    <p><strong>Descripción:</strong> {{ $notification->event->description }}</p>
                @endif
            </div>
        @endif

        <div style="text-align: center; margin: 30px 0;">
            <h3>👍 Por favor confirma tu disponibilidad:</h3>

            <a href="{{ $responseUrl }}&action=confirmed" class="button btn-confirm">
                ✅ Confirmar
            </a>

            <a href="{{ $responseUrl }}&action=maybe" class="button btn-maybe">
                ❓ Tal vez
            </a>

            <a href="{{ $responseUrl }}&action=declined" class="button btn-decline">
                ❌ No puedo
            </a>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <a href="{{ $calendarUrl }}" class="button btn-calendar">
                📅 Agregar al Calendario
            </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p><strong>¿Necesitas más información?</strong></p>
            <p>Puedes responder a este email o contactar directamente con el líder de tu ministerio.</p>
        </div>
    </div>

    <div class="footer">
        <p>Este mensaje fue enviado desde el sistema de gestión de la iglesia.</p>
        <p>No es necesario que tengas una cuenta para responder a esta notificación.</p>
    </div>
</body>
</html>
