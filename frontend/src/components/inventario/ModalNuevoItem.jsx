import { useState, useEffect } from 'react';
import { createItem } from '../../api/client';

function ModalNuevoItem({ abierto, onCerrar, onGuardado }) {
    const [codigo, setCodigo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [unidad, setUnidad] = useState('');
    const [precio, setPrecio] = useState('');
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (abierto) { setCodigo(''); setDescripcion(''); setCantidad(''); setUnidad(''); setPrecio(''); setError(null); }
    }, [abierto]);

    useEffect(() => {
        if (!abierto) return;
        function handleEsc(e) { if (e.key === 'Escape' && !guardando) onCerrar(); }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [abierto, guardando, onCerrar]);

    async function handleSubmit(e) {
        e.preventDefault(); setGuardando(true); setError(null);
        try {
            await createItem({ codigo, descripcion, cantidad: parseInt(cantidad, 10), unidad, precio: parseFloat(precio) });
            onGuardado();
        } catch (err) { setError(err.message); } finally { setGuardando(false); }
    }

    if (!abierto) return null;

    return (
        <>
            <div onClick={guardando ? undefined : onCerrar} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><span className="text-white text-xl">📦</span></div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">Nuevo Ítem</h3>
                                    <p className="text-xs text-emerald-50">Completá los datos del producto</p>
                                </div>
                            </div>
                            <button onClick={onCerrar} disabled={guardando} className="w-8 h-8 rounded-full hover:bg-white/20 text-white text-xl leading-none flex items-center justify-center transition-colors disabled:opacity-50" title="Cerrar">&times;</button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Código del producto</label>
                                <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ej: SP7875" required autoFocus className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Descripción</label>
                                <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Caja de tornillos 3mm" required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Cantidad</label>
                                    <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="0" required min="0" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-center text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Unidad</label>
                                    <input type="text" value={unidad} onChange={(e) => setUnidad(e.target.value)} placeholder="Caja, Unidad..." required className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Costo</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input type="number" step="0.01" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="0.00" required className="w-full border border-gray-300 rounded-lg pl-7 pr-4 py-2.5 text-sm text-right text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                                    </div>
                                </div>
                            </div>
                            {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2"><span className="text-lg leading-none">⚠️</span><span>{error}</span></div>)}
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                            <button type="button" onClick={onCerrar} disabled={guardando} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50">Cancelar</button>
                            <button type="submit" disabled={guardando} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                                {guardando ? (<><span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span> Guardando...</>) : (<>Guardar Ítem</>)}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
export default ModalNuevoItem;
