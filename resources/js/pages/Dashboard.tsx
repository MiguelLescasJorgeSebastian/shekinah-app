import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Calendar,
    Church,
    UserCheck,
    CalendarDays,
    Clock,
    Settings,
    Plus
} from 'lucide-react';

interface DashboardProps {
    stats: {
        total_ministries: number;
        total_servers: number;
        upcoming_events: number;
        this_week_schedules: number;
    };
    upcomingEvents: Array<{
        id: number;
        name: string;
        start_datetime: string;
        type: string;
        location?: string;
    }>;
    userMinistries: Array<{
        id: number;
        name: string;
        description?: string;
        color: string;
        servers: Array<{
            id: number;
            user: {
                name: string;
                email: string;
            };
            position?: string;
        }>;
    }>;
    userRole: string;
    permissions: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats,
    upcomingEvents,
    userMinistries,
    userRole,
    permissions
}: DashboardProps) {
    const canViewMinistries = permissions.includes('view ministries');
    const canCreateMinistries = permissions.includes('create ministries');
    const canViewEvents = permissions.includes('view events');
    const canCreateEvents = permissions.includes('create events');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Gestión Ministerial" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Panel de Control
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {userRole === 'Leader' && 'Líder Superior'}
                            {userRole === 'Manager' && 'Encargado de Ministerio'}
                            {userRole === 'Server' && 'Servidor'}
                            {userRole === 'User' && 'Usuario'}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {canCreateMinistries && (
                            <Link
                                href="/ministries/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Nuevo Ministerio
                            </Link>
                        )}
                        {canCreateEvents && (
                            <Link
                                href="/events/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                                <Plus className="h-4 w-4" />
                                Nuevo Evento
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Ministerios Activos
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_ministries}
                                </p>
                            </div>
                            <Church className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Servidores
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.total_servers}
                                </p>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Eventos Próximos
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.upcoming_events}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Horarios Esta Semana
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.this_week_schedules}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Próximos Eventos */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Próximos Eventos
                            </h3>
                            {canViewEvents && (
                                <Link
                                    href="/events"
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    Ver todos
                                </Link>
                            )}
                        </div>

                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-600"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CalendarDays className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {event.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(event.start_datetime).toLocaleDateString('es-ES', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                            {event.type}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                    No hay eventos próximos programados.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Ministerios del Usuario */}
                    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {userRole === 'Leader' ? 'Todos los Ministerios' : 'Mis Ministerios'}
                            </h3>
                            {canViewMinistries && (
                                <Link
                                    href="/ministries"
                                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                >
                                    Ver todos
                                </Link>
                            )}
                        </div>

                        <div className="space-y-3">
                            {userMinistries.length > 0 ? (
                                userMinistries.map((ministry) => (
                                    <div
                                        key={ministry.id}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-600"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-4 w-4 rounded-full"
                                                style={{ backgroundColor: ministry.color }}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {ministry.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {ministry.servers.length} servidores
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {ministry.servers.length}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400">
                                    {userRole === 'Leader'
                                        ? 'No hay ministerios registrados.'
                                        : 'No tienes ministerios asignados.'
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
