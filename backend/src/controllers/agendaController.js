const { Categoria, Contacto } = require('../models');

const getCategorias = async (req, res) => { const cat = await Categoria.findAll(); res.json(cat); };
const createCategoria = async (req, res) => { const nueva = await Categoria.create(req.body); res.status(201).json(nueva); };
const updateCategoria = async (req, res) => { await Categoria.update(req.body, { where: { id: req.params.id } }); res.json({ msg: 'Ok' }); };
const deleteCategoria = async (req, res) => { await Categoria.destroy({ where: { id: req.params.id } }); res.status(204).send(); };
const getContactos = async (req, res) => { 
    const contactos = await Contacto.findAll({ 
        include: [{ 
            model: Categoria, 
            as: 'Categoria'
        }] 
    }); 
    res.json(contactos); 
};
const createContacto = async (req, res) => { const nuevo = await Contacto.create(req.body); res.status(201).json(nuevo); };
const updateContacto = async (req, res) => { 
    const { id } = req.params;
    
    const { paterno, materno, nombre, telefono, email, categoriaId } = req.body;
    
    await Contacto.update(
        { paterno, materno, nombre, telefono, email, categoriaId }, 
        { where: { id } }
    ); 
    res.json({ msg: 'Ok' }); 
};
const deleteContacto = async (req, res) => { await Contacto.destroy({ where: { id: req.params.id } }); res.status(204).send(); };

module.exports = { getCategorias, createCategoria, updateCategoria, deleteCategoria, getContactos, createContacto, updateContacto, deleteContacto };
