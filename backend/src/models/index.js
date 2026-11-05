const User = require('./User');
const Ticket = require('./Ticket');
const Categoria = require('./Categoria');
const Contacto = require('./Contacto');
const Item = require('./Item');
const Perfil = require('./Perfil');
const Proveedor = require('./Proveedor');
const Mensaje = require('./Mensaje')
const sequelize = require('../config/db');

// Relaciones de Tickets 
User.hasMany(Ticket, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE'
});

Ticket.belongsTo(User, {
    foreignKey: { name: 'userId', allowNull: false },
    onDelete: 'CASCADE'
});

// Relaciones de la Agenda 
// Relaciones Agenda
Categoria.hasMany(Contacto, { 
    foreignKey: 'categoriaId', 
    onDelete: 'CASCADE' 
});

Contacto.belongsTo(Categoria, { 
    foreignKey: 'categoriaId',
    as: 'Categoria'
});


// NUEVAS RELACIONES PARA EL CHAT
Ticket.hasMany(Mensaje, { foreignKey: { name: 'ticketId', allowNull: false }, onDelete: 'CASCADE' });
Mensaje.belongsTo(Ticket, { foreignKey: { name: 'ticketId', allowNull: false } });

User.hasMany(Mensaje, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
Mensaje.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });


module.exports = { User, Ticket, Categoria, Contacto, Item, Perfil, Proveedor, Mensaje, sequelize };

