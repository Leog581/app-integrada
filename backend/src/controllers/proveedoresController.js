const { Proveedor } = require('../models');
const { Op } = require('sequelize');
const searchProveedores = async (req, res) => {
    const q = (req.query.q || '').trim();
    const p = await Proveedor.findAll({ where: { nombre: { [Op.like]: `%${q}%` } }, limit: 40 });
    res.json(p.map(x => ({ id: x.id, text: x.nombre, email: x.email, telefono: x.telefono, direccion: x.direccion })));
};
module.exports = { searchProveedores };
