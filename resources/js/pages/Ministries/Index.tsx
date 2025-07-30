import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Plus,
    Eye,
    Edit,
    Trash2,
    Church
} from 'lucide-react';

interface Ministry {
    id: number;
    name: string;
    description?: string;
    color: string;
    is_active: boolean;
    leader?: {
        id: number;
        name: string;
        email: string;
    };
    parent_ministry?: {
        id: number;
        name: string;
    };
    child_ministries: Array<{
        id: number;
        name: string;
    }>;
    servers: Array<{
        id: number;
        user: {
            name: string;
            email: string;
        };
        position?: string;
    }>;
}

interface MinistriesIndexProps {
    ministries: Ministry[];
    canCreate: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ministerios',
        href: '/ministries',
    },
];

export default function MinistriesIndex({ ministries, canCreate }: MinistriesIndexProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ministerios - Gestión Ministerial" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Ministerios
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona los ministerios y sus servidores
                        </p>
                    </div>

                    {canCreate && (
                        <Link
                            href="/ministries/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo Ministerio
                        </Link>
                    )}
                </div>

                {/* Ministerios Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ministries.length > 0 ? (
                        ministries.map((ministry) => (
                            <div
                                key={ministry.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                {/* Header del ministerio */}
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: ministry.color }}
                                        />
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {ministry.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/ministries/${ministry.id}`}
                                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={`/ministries/${ministry.id}/edit`}
                                            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Descripción */}
                                {ministry.description && (
                                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                        {ministry.description}
                                    </p>
                                )}

                                {/* Líder */}
                                {ministry.leader && (
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Líder
                                        </p>
                                        <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                            {ministry.leader.name}
                                        </p>
                                    </div>
                                )}

                                {/* Ministerio padre */}
                                {ministry.parent_ministry && (
                                    <div className="mb-4">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Pertenece a
                                        </p>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                            {ministry.parent_ministry.name}
                                        </p>
                                    </div>
                                )}

                                {/* Estadísticas */}
                                <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Users className="h-4 w-4" />
                                        <span>{ministry.servers.length} servidores</span>
                                    </div>

                                    {ministry.child_ministries.length > 0 && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Church className="h-4 w-4" />
                                            <span>{ministry.child_ministries.length} sub-ministerios</span>
                                        </div>
                                    )}
                                </div>

                                {/* Servidores recientes */}
                                {ministry.servers.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                            Servidores Recientes
                                        </p>
                                        <div className="space-y-1">
                                            {ministry.servers.slice(0, 3).map((server) => (
                                                <div
                                                    key={server.id}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span className="text-gray-900 dark:text-white">
                                                        {server.user.name}
                                                    </span>
                                                    {server.position && (
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            {server.position}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {ministry.servers.length > 3 && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    +{ministry.servers.length - 3} más
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full">
                            <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <Church className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                    No hay ministerios registrados
                                </h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Comienza creando tu primer ministerio para organizar a los servidores.
                                </p>
                                {canCreate && (
                                    <Link
                                        href="/ministries/create"
                                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Crear Primer Ministerio
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
