import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
    User,
    Mail,
    Phone,
    Church,
    UserPlus,
    Save,
    ArrowLeft,
    Bell,
    MessageSquare
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Ministry, User as UserType } from '@/types';

interface ServerCreateProps extends PageProps {
    users: UserType[];
    ministries: Ministry[];
}

export default function Create({ users, ministries }: ServerCreateProps) {
    const [isExternal, setIsExternal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        ministry_id: '',
        position: '',
        skills: '',
        is_external: false as boolean,

        // Campos para servidores registrados
        user_id: '',

        // Campos para servidores externos
        external_name: '',
        external_email: '',
        external_phone: '',

        // Preferencias de notificación
        email_notifications: true as boolean,
        sms_notifications: false as boolean,
        preferred_contact_method: 'email',

        start_date: '',
        end_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/servers');
    };

    const handleExternalToggle = (external: boolean) => {
        setIsExternal(external);
        setData({
            ...data,
            is_external: external,
            user_id: external ? '' : data.user_id,
            external_name: external ? data.external_name : '',
            external_email: external ? data.external_email : '',
            external_phone: external ? data.external_phone : '',
        });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Servidores', href: '/servers' },
            { title: 'Agregar Servidor', href: '/servers/create' }
        ]}>
            <Head title="Agregar Servidor" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Agregar Nuevo Servidor</h1>
                        <p className="text-gray-600">
                            Registra a alguien para servir en los ministerios de la iglesia
                        </p>
                    </div>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </button>
                </div>

                {/* Formulario */}
                <div className="bg-white shadow rounded-lg">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Tipo de servidor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Tipo de Servidor
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleExternalToggle(false)}
                                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                                        !isExternal
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <User className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <h3 className="font-medium">Usuario Registrado</h3>
                                            <p className="text-sm text-gray-600">
                                                Seleccionar de usuarios existentes en el sistema
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleExternalToggle(true)}
                                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                                        isExternal
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <UserPlus className="w-6 h-6 text-green-600" />
                                        <div>
                                            <h3 className="font-medium">Servidor Externo</h3>
                                            <p className="text-sm text-gray-600">
                                                Agregar alguien que no tiene cuenta en el sistema
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Información del servidor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {!isExternal ? (
                                <div>
                                    <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Usuario
                                    </label>
                                    <select
                                        id="user_id"
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required={!isExternal}
                                    >
                                        <option value="">Seleccionar usuario</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.user_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label htmlFor="external_name" className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            Nombre Completo
                                        </label>
                                        <input
                                            type="text"
                                            id="external_name"
                                            value={data.external_name}
                                            onChange={(e) => setData('external_name', e.target.value)}
                                            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ej: Juan Pérez"
                                            required={isExternal}
                                        />
                                        {errors.external_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.external_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="external_email" className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="external_email"
                                            value={data.external_email}
                                            onChange={(e) => setData('external_email', e.target.value)}
                                            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="juan@example.com"
                                            required={isExternal}
                                        />
                                        {errors.external_email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.external_email}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label htmlFor="external_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="w-4 h-4 inline mr-2" />
                                            Teléfono (opcional)
                                        </label>
                                        <input
                                            type="tel"
                                            id="external_phone"
                                            value={data.external_phone}
                                            onChange={(e) => setData('external_phone', e.target.value)}
                                            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="+1 234 567 8900"
                                        />
                                        {errors.external_phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.external_phone}</p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div>
                                <label htmlFor="ministry_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Church className="w-4 h-4 inline mr-2" />
                                    Ministerio
                                </label>
                                <select
                                    id="ministry_id"
                                    value={data.ministry_id}
                                    onChange={(e) => setData('ministry_id', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Seleccionar ministerio</option>
                                    {ministries.map((ministry) => (
                                        <option key={ministry.id} value={ministry.id}>
                                            {ministry.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.ministry_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.ministry_id}</p>
                                )}
                            </div>
                        </div>

                        {/* Posición y habilidades */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                                    Posición/Rol
                                </label>
                                <input
                                    type="text"
                                    id="position"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Ej: Vocalista, Guitarrista, Ujier"
                                    required
                                />
                                {errors.position && (
                                    <p className="mt-1 text-sm text-red-600">{errors.position}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                                    Habilidades/Notas
                                </label>
                                <textarea
                                    id="skills"
                                    value={data.skills}
                                    onChange={(e) => setData('skills', e.target.value)}
                                    rows={3}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Experiencia, instrumentos, habilidades especiales..."
                                />
                                {errors.skills && (
                                    <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                                )}
                            </div>
                        </div>

                        {/* Preferencias de notificación */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                <Bell className="w-5 h-5 inline mr-2" />
                                Preferencias de Notificación
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="email_notifications"
                                            checked={data.email_notifications}
                                            onChange={(e) => setData('email_notifications', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="email_notifications" className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Notificaciones por email
                                        </label>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="checkbox"
                                            id="sms_notifications"
                                            checked={data.sms_notifications}
                                            onChange={(e) => setData('sms_notifications', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="sms_notifications" className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Notificaciones por SMS
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="preferred_contact_method" className="block text-sm font-medium text-gray-700 mb-2">
                                        Método de contacto preferido
                                    </label>
                                    <select
                                        id="preferred_contact_method"
                                        value={data.preferred_contact_method}
                                        onChange={(e) => setData('preferred_contact_method', e.target.value)}
                                        className="w-full md:w-1/2 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="email">Solo Email</option>
                                        <option value="sms">Solo SMS</option>
                                        <option value="both">Email y SMS</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Fechas de servicio */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de inicio (opcional)
                                </label>
                                <input
                                    type="date"
                                    id="start_date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Fecha de fin (opcional)
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.end_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
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
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Guardando...' : 'Agregar Servidor'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
