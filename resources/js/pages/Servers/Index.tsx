import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Plus,
    Eye,
    Edit,
    Search,
    Filter,
    UserCheck,
    Mail,
    Phone,
    ExternalLink
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Ministry {
    id: number;
    name: string;
    color: string;
}

interface Server {
    id: number;
    position?: string;
    skills?: string;
    is_active: boolean;
    is_external: boolean;
    start_date?: string;
    end_date?: string;
    external_name?: string;
    external_email?: string;
    external_phone?: string;
    email_notifications: boolean;
    sms_notifications: boolean;
    preferred_contact_method: string;
    user?: User;
    ministry?: Ministry;
    created_at: string;
}

interface ServersIndexProps {
    servers: {
        data: Server[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    ministries: Ministry[];
    filters: {
        search?: string;
        ministry_id?: string;
        is_external?: string;
    };
    canCreate: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Servidores',
        href: '/servers',
    },
];

export default function ServersIndex({ servers, ministries, filters = {}, canCreate }: ServersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [ministryFilter, setMinistryFilter] = useState(filters.ministry_id || '');
    const [externalFilter, setExternalFilter] = useState(filters.is_external || '');

    const handleSearch = () => {
        router.get('/servers', {
            search,
            ministry_id: ministryFilter,
            is_external: externalFilter,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setMinistryFilter('');
        setExternalFilter('');
        router.get('/servers', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const getName = (server: Server) => {
        return server.is_external ? server.external_name : server.user?.name;
    };

    const getEmail = (server: Server) => {
        return server.is_external ? server.external_email : server.user?.email;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Servidores - Gestión Ministerial" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Servidores
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona los servidores de todos los ministerios
                        </p>
                    </div>

                    {canCreate && (
                        <Link
                            href="/servers/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo Servidor
                        </Link>
                    )}
                </div>

                {/* Filtros */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-1 gap-4">
                            {/* Búsqueda */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar servidores..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Filtro por ministerio */}
                            <select
                                value={ministryFilter}
                                onChange={(e) => setMinistryFilter(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todos los ministerios</option>
                                {ministries.map((ministry) => (
                                    <option key={ministry.id} value={ministry.id}>
                                        {ministry.name}
                                    </option>
                                ))}
                            </select>

                            {/* Filtro por tipo */}
                            <select
                                value={externalFilter}
                                onChange={(e) => setExternalFilter(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Todos los tipos</option>
                                <option value="false">Miembros registrados</option>
                                <option value="true">Servidores externos</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleSearch}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Filter className="h-4 w-4" />
                                Filtrar
                            </button>
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de servidores */}
                {servers.data.length > 0 ? (
                    <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {servers.data.map((server) => (
                                <div
                                    key={server.id}
                                    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                                >
                                    {/* Header del servidor */}
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            {server.is_external ? (
                                                <ExternalLink className="h-5 w-5 text-orange-500" />
                                            ) : (
                                                <UserCheck className="h-5 w-5 text-green-500" />
                                            )}
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {getName(server) || 'Nombre no disponible'}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {server.is_external ? 'Servidor externo' : 'Miembro registrado'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Link
                                                href={`/servers/${server.id}`}
                                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/servers/${server.id}/edit`}
                                                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Ministerio y posición */}
                                    <div className="mb-4 space-y-2">
                                        {server.ministry && (
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-3 w-3 rounded-full"
                                                    style={{ backgroundColor: server.ministry.color }}
                                                />
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {server.ministry.name}
                                                </span>
                                            </div>
                                        )}
                                        {server.position && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {server.position}
                                            </p>
                                        )}
                                    </div>

                                    {/* Información de contacto */}
                                    <div className="mb-4 space-y-1">
                                        {getEmail(server) && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="h-4 w-4" />
                                                <span>{getEmail(server)}</span>
                                            </div>
                                        )}
                                        {server.is_external && server.external_phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone className="h-4 w-4" />
                                                <span>{server.external_phone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Estado y fechas */}
                                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
                                        <div className="flex items-center gap-2">
                                            {server.is_active ? (
                                                <div className="flex items-center gap-1">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    <span className="text-sm text-green-600 dark:text-green-400">Activo</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                                    <span className="text-sm text-red-600 dark:text-red-400">Inactivo</span>
                                                </div>
                                            )}
                                        </div>

                                        {server.start_date && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Desde {new Date(server.start_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Habilidades */}
                                    {server.skills && (
                                        <div className="mt-4">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                                Habilidades
                                            </p>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {server.skills}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Paginación */}
                        {servers.last_page > 1 && (
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Mostrando {((servers.current_page - 1) * servers.per_page) + 1} a {Math.min(servers.current_page * servers.per_page, servers.total)} de {servers.total} servidores
                                </div>
                                <div className="flex gap-2">
                                    {servers.current_page > 1 && (
                                        <Link
                                            href={`/servers?page=${servers.current_page - 1}`}
                                            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Anterior
                                        </Link>
                                    )}
                                    {servers.current_page < servers.last_page && (
                                        <Link
                                            href={`/servers?page=${servers.current_page + 1}`}
                                            className="rounded-lg border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            Siguiente
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            No hay servidores registrados
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Comienza agregando servidores para organizar mejor los ministerios.
                        </p>
                        {canCreate && (
                            <Link
                                href="/servers/create"
                                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Agregar Primer Servidor
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
