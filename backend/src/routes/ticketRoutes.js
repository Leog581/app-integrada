const express = require('express');
const router = express.Router();
const { 
    createTicket, listMyTickets, getAllTickets, getTicketById, updateTicket, changeTicketStatus, deleteTicket,
    getMensajes, createMensaje, cerrarTicket 
} = require('../controllers/ticketController');
const { authenticate, adminOnly } = require('../middlewares/authMiddleware');

// Rutas - endpoints
router.post('/', authenticate, createTicket);
router.get('/', authenticate, listMyTickets);
router.get('/all', authenticate, adminOnly, getAllTickets);
router.get('/:id', authenticate, getTicketById);
router.patch('/:id', authenticate, updateTicket);
router.patch('/:id/status', authenticate, adminOnly, changeTicketStatus)
router.delete('/:id', authenticate, deleteTicket);
router.get('/:id/mensajes', authenticate, getMensajes);
router.post('/:id/mensajes', authenticate, createMensaje);
router.patch('/:id/cerrar', authenticate, cerrarTicket);

module.exports = router;