import { Head, useForm } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Type, FileText, Users } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Ministry } from '@/types';

interface EventCreateProps extends PageProps {
    ministries: Ministry[];
}

const eventTypes = [
    { value: 'service', label: 'Servicio' },
    { value: 'meeting', label: 'Reunión' },
    { value: 'special', label: 'Especial' },
    { value: 'training', label: 'Entrenamiento' },
    { value: 'outreach', label: 'Alcance' }
] as const;

type EventType = typeof eventTypes[number]['value'];

export default function Create({ ministries }: EventCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        type: 'service' as EventType,
        start_datetime: '',
        end_datetime: '',
        location: '',
        required_ministries: [] as number[],
        status: 'planned',
        is_recurring: false as boolean,
        recurrence_type: '',
        recurrence_config: {} as Record<string, number | string>,
        recurrence_end_date: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/events');
    };

    const toggleMinistry = (ministryId: number) => {
        const isSelected = data.required_ministries.includes(ministryId);
        if (isSelected) {
            setData('required_ministries', data.required_ministries.filter(id => id !== ministryId));
        } else {
            setData('required_ministries', [...data.required_ministries, ministryId]);
        }
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Eventos', href: '/events' },
            { title: 'Crear Evento', href: '/events/create' }
        ]}>
            <Head title="Crear Evento" />

            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Evento</h1>
                    <p className="text-gray-600">Configura un nuevo evento para la iglesia</p>
                </div>

                {/* Formulario */}
                <div className="bg-white shadow rounded-lg">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Type className="w-4 h-4 inline mr-2" />
                                    Nombre del Evento
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Servicio Dominical"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Evento
                                </label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as EventType)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {eventTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                <FileText className="w-4 h-4 inline mr-2" />
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe el evento..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                            )}
                        </div>

                        {/* Fechas y horarios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start_datetime" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Fecha y Hora de Inicio
                                </label>
                                <input
                                    type="datetime-local"
                                    id="start_datetime"
                                    value={data.start_datetime}
                                    onChange={(e) => setData('start_datetime', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.start_datetime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_datetime}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="end_datetime" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Fecha y Hora de Fin
                                </label>
                                <input
                                    type="datetime-local"
                                    id="end_datetime"
                                    value={data.end_datetime}
                                    onChange={(e) => setData('end_datetime', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.end_datetime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_datetime}</p>
                                )}
                            </div>
                        </div>

                        {/* Ubicación */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Ubicación
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ej: Santuario Principal"
                            />
                            {errors.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                            )}
                        </div>

                        {/* Ministerios requeridos */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-2" />
                                Ministerios Requeridos
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {ministries.map((ministry) => (
                                    <label
                                        key={ministry.id}
                                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.required_ministries.includes(ministry.id)}
                                            onChange={() => toggleMinistry(ministry.id)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {ministry.name}
                                            </div>
                                            {ministry.description && (
                                                <div className="text-xs text-gray-500">
                                                    {ministry.description}
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.required_ministries && (
                                <p className="mt-1 text-sm text-red-600">{errors.required_ministries}</p>
                            )}
                        </div>

                        {/* Configuración de Recurrencia */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de Recurrencia</h3>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_recurring"
                                        checked={data.is_recurring}
                                        onChange={(e) => setData('is_recurring', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_recurring" className="ml-2 text-sm font-medium text-gray-700">
                                        Este es un evento recurrente
                                    </label>
                                </div>

                                {data.is_recurring && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <label htmlFor="recurrence_type" className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de Recurrencia
                                            </label>
                                            <select
                                                id="recurrence_type"
                                                value={data.recurrence_type}
                                                onChange={(e) => setData('recurrence_type', e.target.value)}
                                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="weekly">Cada semana</option>
                                                <option value="biweekly">Cada dos semanas</option>
                                                <option value="monthly">Cada mes</option>
                                                <option value="daily">Diario</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="recurrence_end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de fin (opcional)
                                            </label>
                                            <input
                                                type="date"
                                                id="recurrence_end_date"
                                                value={data.recurrence_end_date}
                                                onChange={(e) => setData('recurrence_end_date', e.target.value)}
                                                className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        {(data.recurrence_type === 'weekly' || data.recurrence_type === 'biweekly') && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Día de la semana
                                                </label>
                                                <select
                                                    value={data.recurrence_config?.day_of_week || ''}
                                                    onChange={(e) => setData('recurrence_config', {
                                                        ...data.recurrence_config,
                                                        day_of_week: parseInt(e.target.value)
                                                    })}
                                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="">Seleccionar día...</option>
                                                    <option value="0">Domingo</option>
                                                    <option value="1">Lunes</option>
                                                    <option value="2">Martes</option>
                                                    <option value="3">Miércoles</option>
                                                    <option value="4">Jueves</option>
                                                    <option value="5">Viernes</option>
                                                    <option value="6">Sábado</option>
                                                </select>
                                            </div>
                                        )}

                                        {data.recurrence_type === 'monthly' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Día del mes (1-31)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="31"
                                                    value={data.recurrence_config?.day_of_month || ''}
                                                    onChange={(e) => setData('recurrence_config', {
                                                        ...data.recurrence_config,
                                                        day_of_month: parseInt(e.target.value)
                                                    })}
                                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ej: 15"
                                                />
                                            </div>
                                        )}

                                        {data.recurrence_type === 'daily' && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Intervalo (cada X días)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={data.recurrence_config?.interval || 1}
                                                    onChange={(e) => setData('recurrence_config', {
                                                        ...data.recurrence_config,
                                                        interval: parseInt(e.target.value)
                                                    })}
                                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="1"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Creando...' : 'Crear Evento'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
