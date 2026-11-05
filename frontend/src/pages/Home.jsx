import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { slides } from '../data/slides';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, isAdmin } = useAuth();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Efecto para el carrusel (solo se usa si no hay usuario)
    useEffect(() => {
        if (user) return; // Si hay usuario, no corre el carrusel
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [user]);

    // ==========================================
    // 1. VISTA PARA VISITANTES (No logueados)
    // ==========================================
    if (!user) {
        return (
            <div className="space-y-12">
                <div 
                    className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 bg-cover bg-center"
                    style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
                >
                    <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
                            {slides[currentSlide].title}
                        </h1>
                        <p className="text-lg md:text-2xl font-medium mb-8 max-w-2xl drop-shadow-md">
                            {slides[currentSlide].description}
                        </p>
                        <div className="flex gap-4">
                            <Link to="/register" className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                                Empezar ahora
                            </Link>
                            <Link to="/products" className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-colors shadow-lg">
                                Ver servicios
                            </Link>
                        </div>
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">¿Por qué elegirnos?</h2>
                    <p className="text-gray-600 mb-10">Brindamos soluciones informáticas rápidas, seguras y adaptadas a tus necesidades.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-xl font-bold mb-2">Rápido y Eficiente</h3>
                            <p className="text-gray-600 text-sm">Atendemos tus tickets en tiempo récord para que no frenes tus actividades.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">🔧</div>
                            <h3 className="text-xl font-bold mb-2">Soporte Especializado</h3>
                            <p className="text-gray-600 text-sm">Contamos con expertos en hardware, software y redes listos para ayudarte.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-4">💬</div>
                            <h3 className="text-xl font-bold mb-2">Seguimiento en Vivo</h3>
                            <p className="text-gray-600 text-sm">Mirá el estado de tu problema en todo momento desde tu panel de control.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // 2. VISTA DASHBOARD (Usuarios logueados)
    // ==========================================
    return (
        <div className="max-w-6xl mx-auto mt-4">
            {/* Encabezado de bienvenida */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    ¡Hola de nuevo, {user.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-500 mt-1">¿Qué querés hacer hoy? Seleccioná un módulo para empezar.</p>
            </div>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Módulo Soporte */}
                <Link to="/tickets" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                        🎟️
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Mis Tickets</h3>
                    <p className="text-sm text-gray-500">Revisá el estado de tus problemas reportados y seguí su evolución.</p>
                </Link>

                <Link to="/tickets/new" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-green-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                        ➕
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Nuevo Ticket</h3>
                    <p className="text-sm text-gray-500">¿Tuviste un problema? Reportalo acá y nos ponemos en marcha.</p>
                </Link>

                {/* Módulo Agenda */}
                <Link to="/agenda" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                        📒
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Agenda</h3>
                    <p className="text-sm text-gray-500">Gestioná tus contactos y categorías para tener todo organizado.</p>
                </Link>

                {/* Módulo Inventario */}
                <Link to="/inventario" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                        📦
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Inventario</h3>
                    <p className="text-sm text-gray-500">Controlá el stock, los precios y el valor total de tus productos.</p>
                </Link>

                {/* Módulos exclusivos de Admin */}
                {isAdmin && (
                    <>
                        <Link to="/admin/tickets" className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 hover:shadow-xl hover:border-red-400 hover:-translate-y-1 transition-all duration-300 group text-white">
                            <div className="w-14 h-14 bg-gray-700 text-red-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                ⚙️
                            </div>
                            <h3 className="text-xl font-bold mb-2">Admin Tickets</h3>
                            <p className="text-sm text-gray-300">Gestioná los tickets de todos los usuarios y cambiá sus estados.</p>
                        </Link>

                        <Link to="/admin/users" className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 group text-white">
                            <div className="w-14 h-14 bg-gray-700 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                👥
                            </div>
                            <h3 className="text-xl font-bold mb-2">Usuarios</h3>
                            <p className="text-sm text-gray-300">Administrá los roles y permisos de los usuarios del sistema.</p>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;