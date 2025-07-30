import { Head, router } from '@inertiajs/react';
import {
    Users,
    UserCheck,
    UserX,
    Shield,
    Clock,
    MoreHorizontal,
    UserPlus
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    roles: Array<{
        id: number;
        name: string;
        display_name?: string;
    }>;
}

interface Role {
    id: number;
    name: string;
    display_name?: string;
}

interface UsersIndexProps {
    users: User[];
    pendingUsers: User[];
    roles: Role[];
}

const roleColors = {
    'admin': 'bg-red-100 text-red-800',
    'leader': 'bg-blue-100 text-blue-800',
    'server': 'bg-green-100 text-green-800',
};

const roleLabels = {
    'admin': 'Administrador',
    'leader': 'Líder',
    'server': 'Servidor',
};

export default function UsersIndex({ users, pendingUsers, roles }: UsersIndexProps) {
    const assignRole = (userId: number, role: string) => {
        router.post(`/users/${userId}/assign-role`, { role }, {
            preserveScroll: true,
        });
    };

    const changeRole = (userId: number, role: string) => {
        router.post(`/users/${userId}/change-role`, { role }, {
            preserveScroll: true,
        });
    };

    const deleteUser = (userId: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            router.delete(`/users/${userId}`, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout>
            <Head title="Gestión de Usuarios" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-muted-foreground">
                            Administra usuarios y asigna roles en el sistema
                        </p>
                    </div>
                </div>

                {/* Usuarios Pendientes */}
                {pendingUsers.length > 0 && (
                    <div className="rounded-lg border bg-yellow-50 border-yellow-200">
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-yellow-600" />
                                <h2 className="text-lg font-semibold text-yellow-800">
                                    Usuarios Pendientes de Asignación ({pendingUsers.length})
                                </h2>
                            </div>
                            <p className="text-sm text-yellow-700 mb-6">
                                Estos usuarios se han registrado pero aún no tienen un rol asignado.
                            </p>

                            <div className="space-y-4">
                                {pendingUsers.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <UserPlus className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{user.name}</h3>
                                                <p className="text-sm text-gray-600">{user.email}</p>
                                                <p className="text-xs text-gray-500">
                                                    Registrado: {formatDate(user.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Select onValueChange={(role) => assignRole(user.id, role)}>
                                                <SelectTrigger className="w-40">
                                                    <SelectValue placeholder="Asignar rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.name}>
                                                            {roleLabels[role.name as keyof typeof roleLabels] || role.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        <UserX className="mr-2 h-4 w-4" />
                                                        Eliminar usuario
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Usuarios con Roles */}
                <div className="rounded-lg border bg-card">
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold">
                                Usuarios Activos ({users.length})
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {users.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <UserCheck className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">{user.name}</h3>
                                                {user.roles.map((role) => (
                                                    <Badge
                                                        key={role.id}
                                                        className={roleColors[role.name as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}
                                                    >
                                                        <Shield className="w-3 h-3 mr-1" />
                                                        {roleLabels[role.name as keyof typeof roleLabels] || role.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            <p className="text-xs text-gray-500">
                                                Miembro desde: {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Select onValueChange={(role) => changeRole(user.id, role)}>
                                            <SelectTrigger className="w-40">
                                                <SelectValue placeholder="Cambiar rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roles.map((role) => (
                                                    <SelectItem key={role.id} value={role.name}>
                                                        {roleLabels[role.name as keyof typeof roleLabels] || role.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => deleteUser(user.id)}
                                                >
                                                    <UserX className="mr-2 h-4 w-4" />
                                                    Eliminar usuario
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            {users.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No hay usuarios con roles asignados
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
