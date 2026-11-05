const { Item } = require('../models');
const getItems = async (req, res) => {
    const rows = await Item.findAll({ order: [['id', 'ASC']] });
    const items = rows.map(r => ({ id: r.id, codigo: r.codigo, descripcion: r.descripcion, unidad: r.unidad, cantidad: Number(r.cantidad), precio: Number(r.precio), total: Number((r.cantidad * r.precio).toFixed(2)) }));
    const valorTotal = items.reduce((sum, i) => sum + i.total, 0);
    const stockTotal = items.reduce((sum, i) => sum + i.cantidad, 0);
    res.json({ items, valorTotal: Number(valorTotal.toFixed(2)), stockTotal });
};
const createItem = async (req, res) => { const nuevo = await Item.create(req.body); res.status(201).json(nuevo); };
const updateItem = async (req, res) => {
    const { id } = req.params; const { campo, valor } = req.body; const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item no encontrado' });
    if (campo === 1) item.cantidad = parseInt(valor, 10); else if (campo === 2) item.precio = parseFloat(valor);
    await item.save(); res.json(item);
};
const deleteItem = async (req, res) => { await Item.destroy({ where: { id: req.params.id } }); res.status(204).send(); };
module.exports = { getItems, createItem, updateItem, deleteItem };
