import { useState, useEffect } from 'react';
import { getContactos, createContacto, updateContacto, deleteContacto, getCategorias, createCategoria, deleteCategoria } from '../api/client';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';

const Agenda = () => {
    const { isAdmin } = useAuth(); // <--- Traemos el rol
    
    const [contactos, setContactos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filtros y Ordenamiento
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    
    // Modales
    const [modalContactoOpen, setModalContactoOpen] = useState(false);
    const [modalCategoriaOpen, setModalCategoriaOpen] = useState(false);
    
    // Formulario Contacto
    const [formData, setFormData] = useState({ id: null, paterno: '', nombre: '', telefono: '', email: '', categoriaId: '' });
    
    // Formulario Categoría
    const [nuevaCatNombre, setNuevaCatNombre] = useState('');
    const [nuevaCatDesc, setNuevaCatDesc] = useState('');

    const cargarDatos = async () => {
        try {
            const [dataContactos, dataCategorias] = await Promise.all([getContactos(), getCategorias()]);
            setContactos(dataContactos);
            setCategorias(dataCategorias);
            
            if (dataCategorias.length > 0 && !formData.categoriaId) {
                setFormData(prev => ({ ...prev, categoriaId: String(dataCategorias[0].id) }));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargarDatos(); }, []);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
        }
        setSortConfig({ key: direction ? key : null, direction });
    };

    const handleOpenModal = (contacto = null) => {
        if (contacto) {
            setFormData({
                id: contacto.id,
                paterno: contacto.paterno || '',
                nombre: contacto.nombre || '',
                telefono: contacto.telefono || '',
                email: contacto.email || '',
                categoriaId: String(contacto.categoriaId || contacto.Categoria?.id || '')
            });
        } else {
            setFormData({ 
                id: null, paterno: '', nombre: '', telefono: '', email: '', 
                categoriaId: categorias[0]?.id ? String(categorias[0].id) : '' 
            });
        }
        setModalContactoOpen(true);
    };

    const handleSubmitContacto = async (e) => {
        e.preventDefault();
        if (!formData.categoriaId) {
            alert('Por favor, seleccioná una categoría.');
            return;
        }
        
        const dataToSend = { ...formData };
        delete dataToSend.id; 

        try {
            if (formData.id) {
                await updateContacto(formData.id, dataToSend);
            } else {
                await createContacto(dataToSend);
            }
            setModalContactoOpen(false);
            cargarDatos();
        } catch (error) {
            alert('Error al guardar el contacto');
        }
    };

    const handleDeleteContacto = async (id) => {
        if (window.confirm('¿Seguro que querés eliminar este contacto?')) { 
            await deleteContacto(id); 
            cargarDatos(); 
        }
    };

    const handleCrearCategoria = async (e) => {
        e.preventDefault();
        if (!nuevaCatNombre.trim()) return;
        try {
            await createCategoria({ nombre: nuevaCatNombre, descripcion: nuevaCatDesc });
            setNuevaCatNombre('');
            setNuevaCatDesc('');
            cargarDatos();
        } catch (error) {
            alert('Error al crear la categoría');
        }
    };

    const handleDeleteCategoria = async (id) => {
        if (window.confirm('¿Eliminar esta categoría? Los contactos asociados quedarán sin categoría.')) {
            try {
                await deleteCategoria(id);
                cargarDatos();
            } catch (error) {
                alert('No se puede eliminar porque hay contactos usándola.');
            }
        }
    };

    let contactosProcesados = contactos.filter(c => {
        const term = busqueda.toLowerCase();
        const coincideBusqueda = (
            (c.nombre && c.nombre.toLowerCase().includes(term)) ||
            (c.paterno && c.paterno.toLowerCase().includes(term)) ||
            (c.email && c.email.toLowerCase().includes(term))
        );
        const coincideCategoria = filtroCategoria === '' || String(c.categoriaId) === String(filtroCategoria);
        return coincideBusqueda && coincideCategoria;
    });

    if (sortConfig.key && sortConfig.direction) {
        contactosProcesados.sort((a, b) => {
            let valA, valB;
            if (sortConfig.key === 'categoria') {
                valA = a.Categoria?.nombre || '';
                valB = b.Categoria?.nombre || '';
            } else {
                valA = a[sortConfig.key] || '';
                valB = b[sortConfig.key] || '';
            }
            valA = String(valA).toLowerCase();
            valB = String(valB).toLowerCase();
            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    if (loading) return <Loading />;

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <span className="text-gray-400 ml-1 opacity-50">↕</span>;
        if (sortConfig.direction === 'asc') return <span className="text-white ml-1">⬆</span>;
        if (sortConfig.direction === 'desc') return <span className="text-white ml-1">⬇</span>;
        return null;
    };

    return (
        <div className="max-w-6xl mx-auto mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-800">Agenda</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestioná tus contactos y categorías</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={String(cat.id)}>{cat.nombre}</option>
                        ))}
                    </select>

                    <div className="relative flex-grow lg:flex-grow-0 lg:w-56">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Buscar contacto..." 
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    
                    {/* BOTONES SOLO PARA ADMIN */}
                    {isAdmin && (
                        <>
                            <button 
                                onClick={() => setModalCategoriaOpen(true)} 
                                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 border border-gray-300 text-sm"
                            >
                                ⚙️ Categorías
                            </button>
                            <button 
                                onClick={() => handleOpenModal()} 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm"
                            >
                                + Nuevo Contacto
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-800 text-white text-sm uppercase tracking-wider select-none">
                            <th className="p-4 font-semibold cursor-pointer hover:bg-gray-700" onClick={() => handleSort('paterno')}>
                                <div className="flex items-center">Apellido {getSortIcon('paterno')}</div>
                            </th>
                            <th className="p-4 font-semibold cursor-pointer hover:bg-gray-700" onClick={() => handleSort('nombre')}>
                                <div className="flex items-center">Nombre {getSortIcon('nombre')}</div>
                            </th>
                            <th className="p-4 font-semibold">Teléfono</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold cursor-pointer hover:bg-gray-700" onClick={() => handleSort('categoria')}>
                                <div className="flex items-center">Categoría {getSortIcon('categoria')}</div>
                            </th>
                            
                            {/* COLUMNA ACCIONES SOLO PARA ADMIN */}
                            {isAdmin && <th className="p-4 font-semibold text-center">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {contactosProcesados.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? "6" : "5"} className="p-8 text-center text-gray-500 font-medium">
                                    No se encontraron contactos.
                                </td>
                            </tr>
                        ) : (
                            contactosProcesados.map(c => (
                                <tr key={c.id} className="hover:bg-blue-50/50 transition-colors even:bg-gray-50/50">
                                    {/* ESTOS ERAN LOS <td> QUE SE HABÍAN BORRADO */}
                                    <td className="p-4 text-sm font-bold text-gray-800">{c.paterno || '-'}</td>
                                    <td className="p-4 text-sm text-gray-700">{c.nombre}</td>
                                    <td className="p-4 text-sm text-gray-600">{c.telefono || '-'}</td>
                                    <td className="p-4 text-sm text-gray-600">{c.email || '-'}</td>
                                    <td className="p-4 text-sm">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                                            {c.Categoria?.nombre || 'Sin categoría'}
                                        </span>
                                    </td>
                                    
                                    {/* BOTONES SOLO PARA ADMIN */}
                                    {isAdmin && (
                                        <td className="p-4 text-center flex justify-center gap-2">
                                            <button onClick={() => handleOpenModal(c)} className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg text-sm font-bold transition-colors" title="Editar">✏️</button>
                                            <button onClick={() => handleDeleteContacto(c.id)} className="text-red-600 hover:bg-red-100 p-2 rounded-lg text-sm font-bold transition-colors" title="Eliminar">✖</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL NUEVO/EDITAR CONTACTO */}
            {modalContactoOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">{formData.id ? 'Editar Contacto' : 'Nuevo Contacto'}</h2>
                            <button onClick={() => setModalContactoOpen(false)} className="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmitContacto} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Apellido</label>
                                    <input type="text" value={formData.paterno} onChange={e => setFormData({...formData, paterno: e.target.value})} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombre</label>
                                    <input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                            </div>
                            <div><label className="block text-xs font-bold text-gray-700 mb-1">Teléfono</label><input type="text" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                            <div><label className="block text-xs font-bold text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                                <select 
                                    value={String(formData.categoriaId)} 
                                    onChange={e => setFormData({...formData, categoriaId: e.target.value})} 
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" 
                                    required
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categorias.map(cat => <option key={cat.id} value={String(cat.id)}>{cat.nombre}</option>)}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                <button type="button" onClick={() => setModalContactoOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancelar</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-colors">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL GESTIONAR CATEGORÍAS */}
            {modalCategoriaOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white">Gestionar Categorías</h2>
                            <button onClick={() => setModalCategoriaOpen(false)} className="text-white hover:text-gray-300 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form onSubmit={handleCrearCategoria} className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Crear Nueva Categoría</h3>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Nombre (Ej: Proveedores)" value={nuevaCatNombre} onChange={e => setNuevaCatNombre(e.target.value)} className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-500" required />
                                    <input type="text" placeholder="Descripción (Opcional)" value={nuevaCatDesc} onChange={e => setNuevaCatDesc(e.target.value)} className="w-full border p-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-500" />
                                    <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded-lg font-bold hover:bg-gray-900 transition-colors text-sm">Añadir Categoría</button>
                                </div>
                            </form>
                            <h3 className="text-sm font-bold text-gray-700 mb-3">Categorías Actuales</h3>
                            {categorias.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">No hay categorías creadas.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {categorias.map(cat => (
                                        <li key={cat.id} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-lg">
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{cat.nombre}</p>
                                                {cat.descripcion && <p className="text-xs text-gray-500">{cat.descripcion}</p>}
                                            </div>
                                            <button onClick={() => handleDeleteCategoria(cat.id)} className="text-red-500 hover:text-red-700 p-1" title="Eliminar categoría">🗑️</button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Agenda;