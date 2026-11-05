const express = require('express');
const router = express.Router();
const { authenticate, adminOnly } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/agendaController');

router.get('/categorias', authenticate, ctrl.getCategorias);
router.post('/categorias', authenticate, adminOnly, ctrl.createCategoria);
router.put('/categorias/:id', authenticate, adminOnly, ctrl.updateCategoria);
router.delete('/categorias/:id', authenticate, adminOnly, ctrl.deleteCategoria);

router.get('/contactos', authenticate, ctrl.getContactos);
router.post('/contactos', authenticate, adminOnly, ctrl.createContacto);
router.put('/contactos/:id', authenticate, adminOnly, ctrl.updateContacto);
router.delete('/contactos/:id', authenticate, adminOnly, ctrl.deleteContacto);

module.exports = router;
