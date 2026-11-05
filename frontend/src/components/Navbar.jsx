import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = ({ isActive }) => 
        `px-3 py-2 rounded transition-colors duration-200 ${
            isActive ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-700 text-gray-200'
        }`;

    return (
        <nav className="bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-4 items-center">
                    <Link to="/" className="text-xl font-extrabold text-white flex items-center gap-2 mr-4 hover:text-blue-400 transition-colors">
                        🛠️ Soporte Técnico
                    </Link>

                    <div className="flex gap-2 items-center border-l border-gray-600 pl-4">
                        <NavLink to="/" end className={navLinkClass}>Inicio</NavLink>
                        <NavLink to="/products" className={navLinkClass}>Productos</NavLink>
                        
                        {user && (
                            <>
                                <NavLink to="/agenda" className={navLinkClass}>Agenda</NavLink>
                                <NavLink to="/inventario" className={navLinkClass}>Inventario</NavLink>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                    {!user && (
                        <>
                            <NavLink to="/login" className={navLinkClass}>Login</NavLink>
                            <NavLink to="/register" className={navLinkClass}>Registro</NavLink>
                        </>
                    )}

                    {user && (
                        <>
                            <NavLink to="/tickets" end className={navLinkClass}>Mis tickets</NavLink>
                            <NavLink to="/tickets/new" className={navLinkClass}>Nuevo ticket</NavLink>
                    
                            {isAdmin && (
                                <>
                                    <NavLink to="/admin/tickets" className={navLinkClass}>Admin Tickets</NavLink>
                                    <NavLink to="/admin/users" className={navLinkClass}>Admin Usuarios</NavLink>
                                </>
                            )}

                            <span className="text-sm text-gray-400 ml-4 border-l border-gray-600 pl-4">
                                Hola, <span className="font-bold text-white">{user.name}</span>
                            </span>
                            <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors">
                                Cerrar sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
