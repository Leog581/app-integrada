import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, getMensajes, createMensaje, cerrarTicket } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const TicketDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);
    const chatEndRef = useRef(null);

    const cargarTicket = async () => {
        try {
            const [dataTicket, dataMensajes] = await Promise.all([
                api(`/tickets/${id}`),
                getMensajes(id)
            ]);
            setTicket(dataTicket);
            setMensajes(dataMensajes);
            setEditTitle(dataTicket.title);
            setEditDescription(dataTicket.description);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarTicket();
    }, [id]);

    // Auto-scroll al final del chat cuando llega un mensaje nuevo
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updated = await api(`/tickets/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            });
            setTicket(updated);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que querés eliminar este ticket definitivamente?')) return;
        try {
            await api(`/tickets/${id}`, { method: 'DELETE' });
            navigate('/tickets');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEnviarMensaje = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || enviando) return;
        setEnviando(true);
        try {
            const mensajeCreado = await createMensaje(id, nuevoMensaje);
            setMensajes([...mensajes, mensajeCreado]);
            setNuevoMensaje('');
            // Recargamos el ticket para reflejar el cambio de estado automático
            await cargarTicket();
        } catch (err) {
            alert('Error al enviar: ' + err.message);
        } finally {
            setEnviando(false);
        }
    };

    const handleCerrarTicket = async () => {
        if (!window.confirm('¿Estás seguro de que querés cerrar este ticket? No se podrá reabrir.')) return;
        try {
            await cerrarTicket(id);
            await cargarTicket();
        } catch (err) {
            alert('Error al cerrar: ' + err.message);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="text-center mt-10 text-red-600 font-bold bg-red-50 p-4 rounded max-w-lg mx-auto">{error}</div>;
    if (!ticket) return <div className="text-center mt-10">Ticket no encontrado</div>;

    const isOpen = ticket.status === 'open';
    const isClosed = ticket.status === 'closed';
    // Podés editar título/desc si está abierto, sos el dueño, o sos admin. Pero mejor solo dueño y abierto.
    const canEdit = isOpen && (ticket.userId === user.id || user.role === 'admin');
    const canClose = !isClosed && (ticket.userId === user.id || user.role === 'admin');

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-6">
            {/* Cabecera del Ticket */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
                            <span className="text-gray-300 text-2xl">#{ticket.id}</span>
                            {ticket.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-2 font-medium">
                            📅 Reportado el {new Date(ticket.createdAt).toLocaleString('es-AR')}
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={ticket.status} />
                        {canClose && (
                            <button onClick={handleCerrarTicket} className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                                Cerrar Ticket
                            </button>
                        )}
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                            <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                            <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows="4" className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" required></textarea>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700">Guardar Cambios</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border px-4 py-2 rounded-lg font-bold hover:bg-gray-50">Cancelar</button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 mb-2">Descripción del problema:</h3>
                        <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {ticket.description}
                        </div>
                        {canEdit && (
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => setIsEditing(true)} className="text-yellow-600 text-sm font-bold hover:underline">✏️ Editar</button>
                                <button onClick={handleDelete} className="text-red-600 text-sm font-bold hover:underline">🗑️ Eliminar</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Chat / Conversación */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                    <h3 className="font-bold text-gray-700">Conversación</h3>
                </div>

                {/* Lista de mensajes */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                    {mensajes.length === 0 ? (
                        <p className="text-center text-gray-400 text-sm mt-10">Aún no hay respuestas. ¡Sé el primero en escribir!</p>
                    ) : (
                        mensajes.map((msg) => {
                            const esAdmin = msg.User.role === 'admin';
                            const esMio = msg.userId === user.id;
                            return (
                                <div key={msg.id} className={`flex flex-col ${esMio ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold ${esAdmin ? 'text-purple-600' : 'text-gray-500'}`}>
                                            {msg.User.name} {esAdmin && '(Soporte)'}
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            {new Date(msg.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                                        esMio 
                                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                                            : esAdmin 
                                                ? 'bg-purple-100 text-purple-900 rounded-tl-sm border border-purple-200'
                                                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                                    }`}>
                                        {msg.texto}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input de mensaje */}
                {!isClosed ? (
                    <form onSubmit={handleEnviarMensaje} className="p-4 border-t border-gray-200 bg-white flex gap-3">
                        <input
                            type="text"
                            value={nuevoMensaje}
                            onChange={(e) => setNuevoMensaje(e.target.value)}
                            placeholder="Escribí tu mensaje..."
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            disabled={enviando}
                        />
                        <button 
                            type="submit" 
                            disabled={!nuevoMensaje.trim() || enviando}
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {enviando ? '...' : 'Enviar'}
                        </button>
                    </form>
                ) : (
                    <div className="p-4 border-t border-gray-200 bg-gray-100 text-center text-sm font-bold text-gray-500">
                        🔒 Este ticket está cerrado. No se pueden enviar más mensajes.
                    </div>
                )}
            </div>

            <button onClick={() => navigate(-1)} className="inline-block text-blue-600 font-bold hover:underline">
                ← Volver atrás
            </button>
        </div>
    );
};

export default TicketDetail;