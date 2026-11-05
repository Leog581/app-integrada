import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- IMPORTANTE
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';

const AdminTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchAllTickets = async () => {
            try {
                const data = await api('/tickets/all');
                setTickets(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllTickets();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const updated = await api(`/tickets/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            setTickets(tickets.map(t => t.id === id ? { ...t, status: updated.status } : t));
        } catch (err) {
            alert('Error al cambiar estado: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que querés eliminar este ticket definitivamente?')) return;
        try {
            await api(`/tickets/${id}`, { method: 'DELETE' });
            setTickets(tickets.filter(t => t.id !== id));
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-center mt-10 text-red-600">Error: {error}</div>;

    const filteredTickets = filterStatus === 'all' 
        ? tickets 
        : tickets.filter(t => t.status === filterStatus);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Administrar Todos los Tickets</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Filtrar por estado:</label>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border p-2 rounded bg-white text-sm"
                    >
                        <option value="all">Todos</option>
                        <option value="open">Abiertos</option>
                        <option value="in_progress">En proceso</option>
                        <option value="closed">Cerrados</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Título</th>
                            <th className="p-4 font-semibold">Creador</th>
                            <th className="p-4 font-semibold">Estado</th>
                            <th className="p-4 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No hay tickets con este filtro.</td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-blue-50/50 transition-colors even:bg-gray-50/50">
                                    <td className="p-4 font-bold text-gray-400">#{ticket.id}</td>
                                    <td className="p-4 font-bold text-gray-800">{ticket.title}</td>
                                    <td className="p-4 text-sm">
                                        <div className="font-bold text-gray-700">{ticket.User.name}</div>
                                        <div className="text-gray-500">{ticket.User.email}</div>
                                    </td>
                                    <td className="p-4"><StatusBadge status={ticket.status} /></td>
                                    <td className="p-4 flex gap-3 items-center">
                                        {/* BOTÓN NUEVO PARA IR AL CHAT */}
                                        <Link 
                                            to={`/tickets/${ticket.id}`} 
                                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg text-sm font-bold transition-colors" 
                                            title="Ver / Responder"
                                        >
                                            💬
                                        </Link>
                                        
                                        <select 
                                            value={ticket.status}
                                            onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                            className="border border-gray-300 p-1.5 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                                        >
                                            <option value="open">Abierto</option>
                                            <option value="in_progress">En proceso</option>
                                            <option value="closed">Cerrado</option>
                                        </select>
                                        <button 
                                            onClick={() => handleDelete(ticket.id)}
                                            className="text-red-600 hover:bg-red-100 p-2 rounded-lg text-sm font-bold transition-colors"
                                            title="Eliminar"
                                        >
                                            ✖
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTickets;