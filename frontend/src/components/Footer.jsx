import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Marca y Copyright */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800">App Integrada</span>
                    <span className="text-xs text-gray-400">© {new Date().getFullYear()}</span>
                </div>
                
                {/* Links rápidos */}
                <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
                    <Link to="/products" className="hover:text-blue-600 transition-colors">Servicios</Link>
                    
                    {/* Lógica condicional para el acceso */}
                    {!user ? (
                        <Link to="/login" className="hover:text-blue-600 transition-colors">Acceso</Link>
                    ) : (
                        <>
                            <Link to="/tickets" className="hover:text-blue-600 transition-colors">Mi Panel</Link>
                            <button 
                                onClick={handleLogout} 
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    )}
                </div>

                {/* Créditos o Info extra */}
                <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span>💻</span> Proyecto de Bases de Datos 2
                </div>
            </div>
        </footer>
    );
};

export default Footer;