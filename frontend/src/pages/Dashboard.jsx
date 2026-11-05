import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, isAdmin } = useAuth();

    return (
        <div className="max-w-6xl mx-auto mt-4">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-800">
                    ¡Hola de nuevo, {user.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-500 mt-1">¿Qué querés hacer hoy? Seleccioná un módulo para empezar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link to="/tickets" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🎟️</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Mis Tickets</h3>
                    <p className="text-sm text-gray-500">Revisá el estado de tus problemas reportados y seguí su evolución.</p>
                </Link>

                <Link to="/tickets/new" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-green-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">➕</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Nuevo Ticket</h3>
                    <p className="text-sm text-gray-500">¿Tuviste un problema? Reportalo acá y nos ponemos en marcha.</p>
                </Link>

                <Link to="/agenda" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📒</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Agenda</h3>
                    <p className="text-sm text-gray-500">Gestioná tus contactos y categorías para tener todo organizado.</p>
                </Link>

                <Link to="/inventario" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 group">
                    <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📦</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Inventario</h3>
                    <p className="text-sm text-gray-500">Controlá el stock, los precios y el valor total de tus productos.</p>
                </Link>

                {isAdmin && (
                    <>
                        <Link to="/admin/tickets" className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 hover:shadow-xl hover:border-red-400 hover:-translate-y-1 transition-all duration-300 group text-white">
                            <div className="w-14 h-14 bg-gray-700 text-red-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
                            <h3 className="text-xl font-bold mb-2">Admin Tickets</h3>
                            <p className="text-sm text-gray-300">Gestioná los tickets de todos los usuarios y cambiá sus estados.</p>
                        </Link>
                        <Link to="/admin/users" className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 group text-white">
                            <div className="w-14 h-14 bg-gray-700 text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">👥</div>
                            <h3 className="text-xl font-bold mb-2">Usuarios</h3>
                            <p className="text-sm text-gray-300">Administrá los roles y permisos de los usuarios del sistema.</p>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;