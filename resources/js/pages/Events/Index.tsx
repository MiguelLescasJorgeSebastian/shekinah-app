import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Users, Plus, Search, Filter, Eye } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Event } from '@/types';

interface EventsIndexProps extends PageProps {
    events: Event[];
    filters?: {
        search?: string;
        type?: string;
        status?: string;
    };
}

const eventTypes = {
    service: 'Servicio',
    meeting: 'Reunión',
    special: 'Especial',
    training: 'Entrenamiento',
    outreach: 'Alcance'
} as const;

const eventStatuses = {
    planned: 'Planeado',
    confirmed: 'Confirmado',
    cancelled: 'Cancelado',
    completed: 'Completado'
} as const;

const statusColors = {
    planned: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-blue-100 text-blue-800 border-blue-300'
} as const;

export default function Index({ auth, events, filters = {} }: EventsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = () => {
        router.get('/events', {
            search,
            type: typeFilter,
            status: statusFilter
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearch('');
        setTypeFilter('');
        setStatusFilter('');
        router.get('/events');
    };

    const formatDateTime = (datetime: string) => {
        return new Date(datetime).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Eventos', href: '/events' }]}>
            <Head title="Eventos" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
                        <p className="text-gray-600">Gestiona los eventos de la iglesia</p>
                    </div>
                    {auth.user.permissions?.includes('create events') && (
                        <button
                            onClick={() => router.visit('/events/create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Crear Evento
                        </button>
                    )}
                </div>

                {/* Filtros */}
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Buscar
                            </label>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Nombre del evento..."
                                    className="pl-10 w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo
                            </label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Todos los tipos</option>
                                {Object.entries(eventTypes).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Todos los estados</option>
                                {Object.entries(eventStatuses).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filtrar
                            </button>
                            <button
                                onClick={clearFilters}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de eventos */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No hay eventos
                            </h3>
                            <p className="text-gray-500 mb-4">
                                No se encontraron eventos con los filtros aplicados.
                            </p>
                            {auth.user.permissions?.includes('create events') && (
                                <button
                                    onClick={() => router.visit('/events/create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Crear Primer Evento
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {event.name}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium border rounded-full ${statusColors[event.status]}`}>
                                                    {eventStatuses[event.status]}
                                                </span>
                                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300 rounded-full">
                                                    {eventTypes[event.type]}
                                                </span>
                                            </div>

                                            {event.description && (
                                                <p className="text-gray-600 mb-3">
                                                    {event.description}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Inicia: {formatDateTime(event.start_datetime)}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Termina: {formatDateTime(event.end_datetime)}</span>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {event.schedules && event.schedules.length > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Users className="w-4 h-4" />
                                                        <span>
                                                            {event.schedules.length} ministerio(s) asignado(s)
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => router.visit(`/events/${event.id}`)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                                                title="Ver evento"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
