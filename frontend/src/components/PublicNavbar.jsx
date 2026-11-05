import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicNavbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo App Integrada */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:bg-blue-500 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <span className="text-xl font-extrabold text-gray-800 tracking-tight">App Integrada</span>
                </Link>

                {/* Enlaces y Botones */}
                <div className="flex items-center gap-6">
                    <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors hidden sm:block">
                        Servicios
                    </Link>
                    
                    {!user ? (
                        <>
                            <Link to="/login" className="text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors">
                                Iniciar Sesión
                            </Link>
                            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                                Registrarse
                            </Link>
                        </>
                    ) : (
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-900 transition-colors shadow-sm flex items-center gap-2"
                        >
                            Ir a mi Panel <span>→</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;