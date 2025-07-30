import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    MapPin,
    User,
    CheckCircle,
    XCircle,
    HelpCircle,
    Download,
    Church
} from 'lucide-react';

interface NotificationResponseProps {
    notification: {
        id: number;
        title: string;
        message: string;
        type: string;
        response_status: string | null;
        server: {
            display_name: string;
            position: string;
        };
        schedule?: {
            ministry: {
                name: string;
            };
            day_of_week: string;
            start_time: string;
            end_time: string;
            notes?: string;
        };
        event?: {
            name: string;
            type: string;
            start_datetime: string;
            end_datetime: string;
            location?: string;
            description?: string;
        };
    };
    token: string;
}

const dayTranslations = {
    'monday': 'Lunes',
    'tuesday': 'Martes',
    'wednesday': 'Miércoles',
    'thursday': 'Jueves',
    'friday': 'Viernes',
    'saturday': 'Sábado',
    'sunday': 'Domingo'
};

const eventTypes = {
    'service': 'Servicio',
    'meeting': 'Reunión',
    'special': 'Evento Especial',
    'training': 'Entrenamiento',
    'outreach': 'Alcance'
};

export default function NotificationResponse({ notification, token }: NotificationResponseProps) {
    const [selectedAction, setSelectedAction] = useState<string>('');
    const { data, setData, post, processing } = useForm({
        action: '',
        message: ''
    });

    const handleResponse = (action: string) => {
        setSelectedAction(action);
        setData('action', action);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.action) {
            post(`/server/notification/${token}/respond`);
        }
    };

    const formatDateTime = (datetime: string) => {
        return new Date(datetime).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'confirmed':
                return <CheckCircle className="w-6 h-6" />;
            case 'declined':
                return <XCircle className="w-6 h-6" />;
            case 'maybe':
                return <HelpCircle className="w-6 h-6" />;
            default:
                return null;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'confirmed':
                return 'bg-green-600 hover:bg-green-700 border-green-600';
            case 'declined':
                return 'bg-red-600 hover:bg-red-700 border-red-600';
            case 'maybe':
                return 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600';
            default:
                return 'bg-gray-600 hover:bg-gray-700 border-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={notification.title} />

            {/* Header */}
            <div className="bg-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <Church className="w-8 h-8" />
                        <div>
                            <h1 className="text-2xl font-bold">Sistema de Ministerios</h1>
                            <p className="text-blue-100">Respuesta de Servidor</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Estado de respuesta actual */}
                {notification.response_status && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            {getActionIcon(notification.response_status)}
                            <span className="font-medium">
                                Ya has respondido: {
                                    notification.response_status === 'confirmed' ? 'Confirmado' :
                                    notification.response_status === 'declined' ? 'No puedo asistir' :
                                    'Tal vez'
                                }
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Puedes cambiar tu respuesta seleccionando una nueva opción abajo.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información del servicio/evento */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información principal */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                {notification.title}
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <span className="font-medium">Asignado a:</span> {notification.server.display_name}
                                        {notification.server.position && (
                                            <span className="text-gray-600"> ({notification.server.position})</span>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="whitespace-pre-line text-gray-700">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Detalles del horario */}
                        {notification.schedule && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    📅 Detalles del Servicio
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Church className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-600">Ministerio</span>
                                            <p className="font-medium">{notification.schedule.ministry.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-600">Día</span>
                                            <p className="font-medium">
                                                {dayTranslations[notification.schedule.day_of_week as keyof typeof dayTranslations]}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <span className="text-sm text-gray-600">Horario</span>
                                            <p className="font-medium">
                                                {notification.schedule.start_time} - {notification.schedule.end_time}
                                            </p>
                                        </div>
                                    </div>
                                    {notification.schedule.notes && (
                                        <div className="md:col-span-2">
                                            <span className="text-sm text-gray-600">Notas</span>
                                            <p className="font-medium">{notification.schedule.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Detalles del evento */}
                        {notification.event && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    🎉 Detalles del Evento
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-gray-600">Nombre del Evento</span>
                                        <p className="font-medium text-lg">{notification.event.name}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm text-gray-600">Tipo</span>
                                            <p className="font-medium">
                                                {eventTypes[notification.event.type as keyof typeof eventTypes]}
                                            </p>
                                        </div>
                                        {notification.event.location && (
                                            <div className="flex items-center gap-3">
                                                <MapPin className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <span className="text-sm text-gray-600">Ubicación</span>
                                                    <p className="font-medium">{notification.event.location}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <span className="text-sm text-gray-600">Inicio</span>
                                                <p className="font-medium">
                                                    {formatDateTime(notification.event.start_datetime)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <span className="text-sm text-gray-600">Fin</span>
                                                <p className="font-medium">
                                                    {formatDateTime(notification.event.end_datetime)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {notification.event.description && (
                                        <div>
                                            <span className="text-sm text-gray-600">Descripción</span>
                                            <p className="text-gray-700 bg-gray-50 rounded p-3 mt-1">
                                                {notification.event.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Panel de respuesta */}
                    <div className="space-y-6">
                        {/* Acciones rápidas */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                📅 Agregar al Calendario
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href={`/server/notification/${token}/google-calendar`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Google Calendar
                                </a>

                                <a
                                    href={`/server/notification/${token}/outlook-calendar`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Outlook Calendar
                                </a>

                                <a
                                    href={`/server/notification/${token}/calendar`}
                                    className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Descargar .ics (Apple/Otros)
                                </a>
                            </div>
                        </div>

                        {/* Formulario de respuesta */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                👍 Confirma tu Disponibilidad
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-3">
                                    {['confirmed', 'maybe', 'declined'].map((action) => (
                                        <button
                                            key={action}
                                            type="button"
                                            onClick={() => handleResponse(action)}
                                            className={`w-full p-3 rounded-lg border-2 flex items-center gap-3 transition-colors ${
                                                selectedAction === action
                                                    ? `${getActionColor(action)} text-white`
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            {getActionIcon(action)}
                                            <span className="font-medium">
                                                {action === 'confirmed' && 'Sí, estaré ahí'}
                                                {action === 'maybe' && 'Tal vez pueda'}
                                                {action === 'declined' && 'No puedo asistir'}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {selectedAction && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mensaje adicional (opcional)
                                        </label>
                                        <textarea
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            rows={3}
                                            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Puedes agregar algún comentario aquí..."
                                        />
                                    </div>
                                )}

                                {selectedAction && (
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`w-full p-3 rounded-lg text-white font-medium transition-colors ${
                                            processing
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : `${getActionColor(selectedAction)}`
                                        }`}
                                    >
                                        {processing ? 'Enviando...' : 'Enviar Respuesta'}
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Información de contacto */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">
                                ¿Necesitas más información?
                            </h4>
                            <p className="text-sm text-blue-700">
                                Puedes contactar directamente con el líder de tu ministerio
                                para cualquier pregunta o aclaración.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
