import { useState, useEffect } from 'react';
import { getItems } from '../api/client';
import Totales from '../components/inventario/Totales';
import TablaItems from '../components/inventario/TablaItems';
import ModalNuevoItem from '../components/inventario/ModalNuevoItem';
import Loading from '../components/Loading';

const Inventario = () => {
    const [items, setItems] = useState([]);
    const [valorTotal, setValorTotal] = useState(0);
    const [stockTotal, setStockTotal] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);

    const cargarItems = async () => {
        try {
            const data = await getItems();
            setItems(data.items); setValorTotal(data.valorTotal); setStockTotal(data.stockTotal);
        } catch (err) { console.error(err); } finally { setCargando(false); }
    };

    useEffect(() => { cargarItems(); }, []);

    if (cargando) return <Loading />;

    return (
        <div className="max-w-7xl mx-auto mt-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Inventario</h1>
            <Totales valorTotal={valorTotal} stockTotal={stockTotal} />
            <TablaItems items={items} onRecargar={cargarItems} onAbrirModal={() => setModalAbierto(true)} />
            <ModalNuevoItem abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} onGuardado={() => { setModalAbierto(false); cargarItems(); }} />
        </div>
    );
};
export default Inventario;
