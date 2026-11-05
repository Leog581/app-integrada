import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-40">
                    <div className="text-gray-500 font-medium">Bienvenido al sistema</div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-600">
                                    Hola, <span className="font-bold text-gray-900">{user.name}</span>
                                </span>
                                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700">
                                Iniciar Sesión
                            </button>
                        )}
                    </div>
                </header>

                {/* Contenido de la página */}
                <main className="flex-grow p-6">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;