const { Ticket, User, Mensaje } = require('../models');

const createTicket = async (req, res) => {
    const { title, description } = req.body;

    if(!title || !description){
        return res.status(400).json({ error: 'Título y descripción son obligatorios'});
    }
    const ticket = await Ticket.create({
        title,
        description,
        userId: req.user.id
    });
    return res.status(201).json(ticket);
};

const listMyTickets = async (req, res) => {
    const ticketList = await Ticket.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
    });
    res.json(ticketList);
};

const getAllTickets = async (req, res) => {
    const tickets = await Ticket.findAll({
        include: [{
            model: User,
            attributes: ['name', 'email']
        }],
        order: [['createdAt', 'DESC']]
    });
    res.json(tickets);
};

const getTicketById = async (req, res) => {
    const id = Number(req.params.id);
    if(Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    } 

    const ticket = await Ticket.findByPk(id);
    if(!ticket){
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const isOwner = ticket.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    res.json(ticket);
};

const updateTicket = async (req, res) => {
    const id = Number(req.params.id);
    if(Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    } 

    const ticket = await Ticket.findByPk(id);
    if(!ticket){
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    if (ticket.userId !== req.user.id) {
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }
    if (ticket.status !== 'open') {
        return res.status(403).json({ error: 'No se puede editar un ticket en proceso o cerrado' });
    }
    const { title, description } = req.body;
    if (!title && !description) {
        return res.status(400).json({ error: 'Tenés que enviar al menos un campo para editar' });
    }
    await ticket.update({ title, description });
    res.json(ticket);
};

const changeTicketStatus = async (req, res) => {
    const id = Number(req.params.id);
    if(Number.isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    const ticket = await Ticket.findByPk(id);
    if(!ticket){
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const { status } = req.body;
    const validStatuses = ['open','in_progress','closed'];
    if(!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Estado inválido. Debe ser open, in_progress o closed'});
    }

    await ticket.update ({ status });
    res.json(ticket);
};

const deleteTicket = async (req, res) => {
    const id = Number(req.params.id);
    if(Number.isNaN(id)) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    const ticket = await Ticket.findByPk(id);
    if(!ticket){
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    const isOwner = ticket.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if(!isAdmin && !isOwner){
        return res.status(404).json({ error: 'Ticket no encontrado' });
    }

    if(!isAdmin && ticket.status !== 'open'){
        return res.status(403).json({ error: 'No se puede eliminar un ticket en proceso o cerrado'})
    }

    await ticket.destroy();
    return res.status(204).send();
};

const getMensajes = async (req, res) => {
    const id = Number(req.params.id);
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    const isOwner = ticket.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(404).json({ error: 'Ticket no encontrado' });

    const mensajes = await Mensaje.findAll({
        where: { ticketId: id },
        include: [{ model: User, attributes: ['name', 'role'] }],
        order: [['createdAt', 'ASC']]
    });
    res.json(mensajes);
};

const createMensaje = async (req, res) => {
    const id = Number(req.params.id);
    const { texto } = req.body;
    if (!texto || texto.trim() === '') return res.status(400).json({ error: 'El mensaje no puede estar vacío' });

    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    const isOwner = ticket.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(404).json({ error: 'Ticket no encontrado' });
    if (ticket.status === 'closed') return res.status(403).json({ error: 'El ticket está cerrado' });

    // Si el admin responde y el ticket estaba abierto, lo pasamos a "En proceso"
    if (isAdmin && ticket.status === 'open') {
        await ticket.update({ status: 'in_progress' });
    }

    const nuevoMensaje = await Mensaje.create({
        texto,
        ticketId: id,
        userId: req.user.id
    });

    // Devolvemos el mensaje con los datos del autor para actualizar el frontend
    const mensajeConAutor = await Mensaje.findByPk(nuevoMensaje.id, {
        include: [{ model: User, attributes: ['name', 'role'] }]
    });

    res.status(201).json(mensajeConAutor);
};

const cerrarTicket = async (req, res) => {
    const id = Number(req.params.id);
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });

    const isOwner = ticket.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return res.status(404).json({ error: 'Ticket no encontrado' });

    if (ticket.status === 'closed') {
        return res.status(400).json({ error: 'El ticket ya está cerrado' });
    }

    await ticket.update({ status: 'closed' });
    res.json(ticket);
};

module.exports = { 
    createTicket, listMyTickets, getAllTickets, getTicketById, updateTicket, changeTicketStatus, deleteTicket,
    getMensajes, createMensaje, cerrarTicket 
};

