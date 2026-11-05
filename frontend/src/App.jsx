import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import { useAuth } from './context/AuthContext';

// Páginas Públicas
import LandingPage from './pages/LandingPage';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';

// Páginas Privadas
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import NewTicket from './pages/NewTicket';
import TicketDetail from './pages/TicketDetail';
import AdminTickets from './pages/AdminTickets';
import AdminUsers from './pages/AdminUsers';
import Inventario from './pages/Inventario';
import Agenda from './pages/Agenda';
import NotFound from './pages/NotFound';

const App = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* RUTAS PÚBLICAS (Con PublicNavbar) */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* RUTAS PRIVADAS (Con Sidebar) */}
            <Route element={<Layout />}>
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tickets" element={<MyTickets />} />
                    <Route path="/tickets/new" element={<NewTicket />} />
                    <Route path="/tickets/:id" element={<TicketDetail />} />
                    <Route path="/inventario" element={<Inventario />} />
                    <Route path="/agenda" element={<Agenda />} />
                </Route>

                <Route element={<ProtectedRoute requireAdmin={true} />}>
                    <Route path="/admin/tickets" element={<AdminTickets />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
export default App;