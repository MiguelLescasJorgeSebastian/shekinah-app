import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    FileText,
    Download,
    Eye,
    Calendar,
    User,
    Search,
    Upload
} from 'lucide-react';
import { useState } from 'react';

interface Document {
    id: number;
    title: string;
    description?: string;
    file_name: string;
    file_size: number;
    file_type: string;
    ministry_id?: number;
    uploaded_by_id: number;
    created_at: string;
    updated_at: string;
    ministry?: {
        id: number;
        name: string;
        color: string;
    };
    uploadedBy: {
        id: number;
        name: string;
        email: string;
    };
}

interface DocumentsIndexProps {
    documents: Document[];
    ministries: Array<{
        id: number;
        name: string;
        color: string;
    }>;
    canCreate: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Documentos',
        href: '/documents',
    },
];

export default function DocumentsIndex({
    documents,
    ministries,
    canCreate
}: DocumentsIndexProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMinistry, setSelectedMinistry] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');

    // Filtrar documentos
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doc.file_name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMinistry = !selectedMinistry ||
                              doc.ministry_id?.toString() === selectedMinistry;

        const matchesType = !selectedType || doc.file_type.includes(selectedType);

        return matchesSearch && matchesMinistry && matchesType;
    });

    // Formatear tamaño de archivo
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Formatear fecha
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Obtener icono por tipo de archivo
    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('doc')) return '📝';
        if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
        if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊';
        if (fileType.includes('image')) return '🖼️';
        return '📁';
    };

    // Descargar documento
    const downloadDocument = (documentId: number) => {
        window.open(`/documents/${documentId}/download`, '_blank');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Documentos - Gestión Documental" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Documentos
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona documentos compartidos de la iglesia
                        </p>
                    </div>

                    {canCreate && (
                        <Link
                            href="/documents/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Upload className="h-4 w-4" />
                            Subir Documento
                        </Link>
                    )}
                </div>

                {/* Filtros */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {/* Búsqueda */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Filtro por ministerio */}
                    <select
                        value={selectedMinistry}
                        onChange={(e) => setSelectedMinistry(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Todos los ministerios</option>
                        {ministries.map((ministry) => (
                            <option key={ministry.id} value={ministry.id.toString()}>
                                {ministry.name}
                            </option>
                        ))}
                    </select>

                    {/* Filtro por tipo */}
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">Todos los tipos</option>
                        <option value="pdf">PDF</option>
                        <option value="doc">Word</option>
                        <option value="excel">Excel</option>
                        <option value="image">Imágenes</option>
                    </select>
                </div>

                {/* Lista de documentos */}
                <div className="space-y-4">
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((document) => (
                            <div
                                key={document.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        {/* Icono del archivo */}
                                        <div className="text-2xl">
                                            {getFileIcon(document.file_type)}
                                        </div>

                                        {/* Información del documento */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {document.title}
                                            </h3>

                                            {document.description && (
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    {document.description}
                                                </p>
                                            )}

                                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <FileText className="h-3 w-3" />
                                                    {document.file_name}
                                                </span>
                                                <span>{formatFileSize(document.file_size)}</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(document.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {document.uploadedBy.name}
                                                </span>
                                            </div>

                                            {document.ministry && (
                                                <div className="mt-2">
                                                    <span
                                                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-white"
                                                        style={{ backgroundColor: document.ministry.color }}
                                                    >
                                                        {document.ministry.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => downloadDocument(document.id)}
                                            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        >
                                            <Download className="h-4 w-4" />
                                            Descargar
                                        </button>

                                        <Link
                                            href={`/documents/${document.id}`}
                                            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Ver
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                {searchTerm || selectedMinistry || selectedType
                                    ? 'No se encontraron documentos'
                                    : 'No hay documentos disponibles'
                                }
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {searchTerm || selectedMinistry || selectedType
                                    ? 'Intenta ajustar los filtros para encontrar lo que buscas.'
                                    : 'Comienza subiendo el primer documento para compartir con la comunidad.'
                                }
                            </p>
                            {canCreate && !(searchTerm || selectedMinistry || selectedType) && (
                                <Link
                                    href="/documents/create"
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    <Upload className="h-4 w-4" />
                                    Subir Primer Documento
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
