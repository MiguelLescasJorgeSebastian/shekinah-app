import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Save,
    Loader2
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Ministry {
    id: number;
    name: string;
    description?: string;
    color: string;
}

interface CreateMinistryProps {
    users: User[];
    parentMinistries: Ministry[];
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
    {
        title: 'Crear Ministerio',
        href: '/ministries/create',
    },
];

export default function CreateMinistry({ users, parentMinistries }: CreateMinistryProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        color: '#3B82F6',
        leader_id: '',
        parent_ministry_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ministries.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Ministerio" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Crear Nuevo Ministerio
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Completa la información para crear un nuevo ministerio
                        </p>
                    </div>

                    <Link
                        href="/ministries"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Link>
                </div>

                {/* Formulario */}
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre del Ministerio *
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Ej: Alabanza y Adoración"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={3}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                placeholder="Describe la función y propósito del ministerio"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                            )}
                        </div>

                        {/* Color */}
                        <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Color de Identificación
                            </label>
                            <div className="mt-1 flex items-center gap-3">
                                <input
                                    type="color"
                                    id="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="h-10 w-16 rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
                                />
                                <input
                                    type="text"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="block w-32 rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    placeholder="#3B82F6"
                                />
                            </div>
                            {errors.color && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.color}</p>
                            )}
                        </div>

                        {/* Líder */}
                        <div>
                            <label htmlFor="leader_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Líder del Ministerio
                            </label>
                            <select
                                id="leader_id"
                                value={data.leader_id}
                                onChange={(e) => setData('leader_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Seleccionar líder (opcional)</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {errors.leader_id && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.leader_id}</p>
                            )}
                        </div>

                        {/* Ministerio Padre */}
                        <div>
                            <label htmlFor="parent_ministry_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Ministerio Padre
                            </label>
                            <select
                                id="parent_ministry_id"
                                value={data.parent_ministry_id}
                                onChange={(e) => setData('parent_ministry_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Es un ministerio principal</option>
                                {parentMinistries.map((ministry) => (
                                    <option key={ministry.id} value={ministry.id}>
                                        {ministry.name}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Si este ministerio es parte de otro ministerio más grande, selecciónalo aquí.
                            </p>
                            {errors.parent_ministry_id && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.parent_ministry_id}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Link
                                href="/ministries"
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                <Save className="h-4 w-4" />
                                Crear Ministerio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
