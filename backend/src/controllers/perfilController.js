const { Perfil } = require('../models');
const getPerfil = async (req, res) => { const p = await Perfil.findByPk(1); res.json(p); };
module.exports = { getPerfil };
