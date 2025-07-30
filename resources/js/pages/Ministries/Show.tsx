import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Edit,
    Users,
    UserPlus,
    Church,
    MapPin,
    Mail,
    Phone,
    Calendar
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Server {
    id: number;
    user: User;
    position?: string;
    skills?: string;
    start_date: string;
    is_active: boolean;
}

interface Resource {
    id: number;
    name: string;
    description?: string;
    type: string;
    created_by: User;
    created_at: string;
}

interface Ministry {
    id: number;
    name: string;
    description?: string;
    color: string;
    is_active: boolean;
    leader?: User;
    parent_ministry?: {
        id: number;
        name: string;
    };
    child_ministries: Array<{
        id: number;
        name: string;
        color: string;
    }>;
    servers: Server[];
    resources: Resource[];
}

interface ShowMinistryProps {
    ministry: Ministry;
    canEdit: boolean;
}

const breadcrumbs = (ministry: Ministry): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ministerios',
        href: '/ministries',
    },
    {
        title: ministry.name,
        href: `/ministries/${ministry.id}`,
    },
];

export default function ShowMinistry({ ministry, canEdit }: ShowMinistryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(ministry)}>
            <Head title={`${ministry.name} - Ministerio`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div
                            className="h-6 w-6 rounded-full"
                            style={{ backgroundColor: ministry.color }}
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {ministry.name}
                            </h1>
                            {ministry.description && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    {ministry.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/ministries"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </Link>
                        {canEdit && (
                            <Link
                                href={`/ministries/${ministry.id}/edit`}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4" />
                                Editar
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Información Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Detalles del Ministerio */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Información del Ministerio
                            </h3>

                            <div className="grid gap-4 md:grid-cols-2">
                                {ministry.leader && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Líder
                                        </label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {ministry.leader.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {ministry.leader.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {ministry.parent_ministry && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Ministerio Padre
                                        </label>
                                        <div className="mt-1">
                                            <Link
                                                href={`/ministries/${ministry.parent_ministry.id}`}
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                            >
                                                <Church className="h-4 w-4" />
                                                {ministry.parent_ministry.name}
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Estado
                                    </label>
                                    <div className="mt-1">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            ministry.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                            {ministry.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                        Total de Servidores
                                    </label>
                                    <div className="mt-1">
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {ministry.servers.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sub-ministerios */}
                        {ministry.child_ministries.length > 0 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Sub-ministerios
                                </h3>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {ministry.child_ministries.map((child) => (
                                        <Link
                                            key={child.id}
                                            href={`/ministries/${child.id}`}
                                            className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: child.color }}
                                            />
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {child.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Servidores */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Servidores ({ministry.servers.length})
                                </h3>
                                {canEdit && (
                                    <button className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
                                        <UserPlus className="h-4 w-4" />
                                        Agregar Servidor
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3">
                                {ministry.servers.length > 0 ? (
                                    ministry.servers.map((server) => (
                                        <div
                                            key={server.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-100 p-4 dark:border-gray-600"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center dark:bg-gray-700">
                                                    <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {server.user.name}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {server.user.email}
                                                        </span>
                                                        {server.position && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {server.position}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {server.skills && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            <strong>Habilidades:</strong> {server.skills}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                    server.is_active
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }`}>
                                                    {server.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Desde {new Date(server.start_date).toLocaleDateString('es-ES')}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                            No hay servidores asignados
                                        </h3>
                                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                                            Agrega servidores para que puedan participar en este ministerio.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Recursos */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Recursos
                            </h3>

                            {ministry.resources.length > 0 ? (
                                <div className="space-y-3">
                                    {ministry.resources.slice(0, 3).map((resource) => (
                                        <div
                                            key={resource.id}
                                            className="rounded-lg border border-gray-100 p-3 dark:border-gray-600"
                                        >
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                {resource.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {resource.type} • {resource.created_by.name}
                                            </p>
                                        </div>
                                    ))}
                                    {ministry.resources.length > 3 && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            +{ministry.resources.length - 3} recursos más
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    No hay recursos disponibles
                                </p>
                            )}
                        </div>

                        {/* Acciones Rápidas */}
                        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Acciones Rápidas
                            </h3>

                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Ver Horarios</span>
                                </button>
                                <button className="w-full flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Gestionar Servidores</span>
                                </button>
                                <button className="w-full flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Ver Eventos</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
