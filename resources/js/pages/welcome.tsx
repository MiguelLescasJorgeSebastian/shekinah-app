import { Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Church, Heart, Users, Calendar, Mail, BookOpen } from 'lucide-react';

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <Head title="Bienvenido" />

            <div className="bg-gray-50 min-h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-6">
                            <div className="flex items-center space-x-3">
                                <Church className="w-8 h-8 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">Sistema de Ministerios</h1>
                            </div>

                            <nav className="flex items-center space-x-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 font-medium"
                                        >
                                            Iniciar Sesión
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Registrarse
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mb-8">
                            <Church className="w-20 h-20 text-blue-600 mx-auto mb-6" />
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                Bienvenido a nuestro
                                <span className="block text-blue-600">Sistema de Ministerios</span>
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Una plataforma diseñada para coordinar, organizar y fortalecer todos los ministerios
                                de nuestra iglesia. Únete para servir y hacer la diferencia en nuestra comunidad.
                            </p>

                            {!auth.user && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center space-x-2"
                                    >
                                        <Heart className="w-5 h-5" />
                                        <span>Únete al Ministerio</span>
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                ¿Qué puedes hacer en nuestro sistema?
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Herramientas diseñadas para fortalecer la comunión y el servicio en nuestra iglesia
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-blue-50 rounded-lg p-6 text-center">
                                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Ministerios</h3>
                                <p className="text-gray-600">
                                    Organiza y coordina todos los ministerios de la iglesia, desde música hasta alcance.
                                </p>
                            </div>

                            <div className="bg-green-50 rounded-lg p-6 text-center">
                                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Eventos y Horarios</h3>
                                <p className="text-gray-600">
                                    Programa servicios, reuniones y eventos especiales con notificaciones automáticas.
                                </p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-6 text-center">
                                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Voluntarios y Servidores</h3>
                                <p className="text-gray-600">
                                    Coordina voluntarios y asigna responsabilidades de manera eficiente.
                                </p>
                            </div>

                            <div className="bg-yellow-50 rounded-lg p-6 text-center">
                                <Mail className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Notificaciones Inteligentes</h3>
                                <p className="text-gray-600">
                                    Recibe recordatorios por email y agrega eventos directamente a tu calendario.
                                </p>
                            </div>

                            <div className="bg-red-50 rounded-lg p-6 text-center">
                                <BookOpen className="w-12 h-12 text-red-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Recursos Compartidos</h3>
                                <p className="text-gray-600">
                                    Accede a materiales, documentos y recursos necesarios para tu ministerio.
                                </p>
                            </div>

                            <div className="bg-indigo-50 rounded-lg p-6 text-center">
                                <Church className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Comunidad Unida</h3>
                                <p className="text-gray-600">
                                    Fortalece la comunicación y coordinación entre todos los miembros.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 bg-blue-600">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            ¿Listo para servir?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Únete a nuestro sistema y forma parte activa de los ministerios de nuestra iglesia.
                            Tu talento y corazón pueden marcar la diferencia.
                        </p>

                        {!auth.user && (
                            <Link
                                href={route('register')}
                                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
                            >
                                <Heart className="w-5 h-5" />
                                <span>Comenzar Ahora</span>
                            </Link>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Church className="w-6 h-6" />
                            <span className="font-semibold">Sistema de Ministerios</span>
                        </div>
                        <p className="text-gray-400">
                            © 2025 Iglesia. Sirviendo juntos con amor y propósito.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
