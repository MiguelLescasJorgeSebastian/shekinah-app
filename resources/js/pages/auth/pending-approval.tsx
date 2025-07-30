import { Head } from '@inertiajs/react';
import { Clock, Church, Mail, CheckCircle } from 'lucide-react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';

interface PendingApprovalProps {
    user: {
        name: string;
        email: string;
    };
}

export default function PendingApproval({ user }: PendingApprovalProps) {
    return (
        <AuthLayout
            title="Cuenta Pendiente de Aprobación"
            description="Tu cuenta ha sido creada exitosamente y está siendo revisada por nuestros administradores"
        >
            <Head title="Pendiente de Aprobación - Sistema de Ministerios" />

            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        ¡Bienvenido, {user.name}!
                    </h2>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Church className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-blue-900">
                                    Tu cuenta está siendo revisada
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Un administrador asignará tu rol en el ministerio próximamente.
                                    Mientras tanto, no puedes acceder al sistema.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-green-900">
                                    Cuenta creada exitosamente
                                </p>
                                <p className="text-sm text-green-700 mt-1">
                                    Recibirás una notificación por email cuando tu cuenta sea aprobada.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    Información de contacto
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                    Email registrado: <span className="font-medium">{user.email}</span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Si tienes preguntas, contacta directamente con los líderes de la iglesia.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-3">
                    <Button
                        onClick={() => window.location.reload()}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        Verificar Estado de Cuenta
                    </Button>

                    <Button
                        onClick={() => window.location.href = '/logout'}
                        variant="outline"
                        className="w-full"
                    >
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </AuthLayout>
    );
}
