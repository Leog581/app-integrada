import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, isAdmin } = useAuth();
    
    const linkClass = ({ isActive }) => 
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        }`;

    return (
        <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen sticky top-0 overflow-y-auto">
            {/* Logo y Título */}
            <div className="p-6 border-b border-gray-800">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-blue-500 transition-colors">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white leading-tight">App Integrada</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Panel de Control</p>
                    </div>
                </Link>
            </div>

            {/* Navegación */}
            <nav className="flex-1 p-4 space-y-2">
                <NavLink to="/" end className={linkClass}>
                    <span>🏠</span> Inicio
                </NavLink>
                
                {user && (
                    <>
                        <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Soporte</div>
                        <NavLink to="/tickets" end className={linkClass}>
                            <span>🎟️</span> Mis Tickets
                        </NavLink>
                        <NavLink to="/tickets/new" className={linkClass}>
                            <span>➕</span> Nuevo Ticket
                        </NavLink>

                        <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Módulos</div>
                        <NavLink to="/agenda" className={linkClass}>
                            <span>📒</span> Agenda
                        </NavLink>
                        {isAdmin && (
                            <NavLink to="/inventario" className={linkClass}>
                                <span>📦</span> Inventario
                            </NavLink>
                        )}

                        {isAdmin && (
                            <>
                                <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin</div>
                                <NavLink to="/admin/tickets" className={linkClass}>
                                    <span>⚙️</span> Admin Tickets
                                </NavLink>
                                <NavLink to="/admin/users" className={linkClass}>
                                    <span>👥</span> Usuarios
                                </NavLink>
                            </>
                        )}
                    </>
                )}

                <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Público</div>
                <NavLink to="/products" className={linkClass}>
                    <span>🛍️</span> Servicios
                </NavLink>
            </nav>
        </aside>
    );
};

export default Sidebar;