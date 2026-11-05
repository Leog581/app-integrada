require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { User, sequelize } = require('./models');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

// Rutas
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const agendaRoutes = require('./routes/agendaRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const perfilRoutes = require('./routes/perfilRoutes');
const proveedoresRoutes = require('./routes/proveedoresRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

// Endpoint testeo base de datos 
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Ruta Keep-Alive para el cron de Vercel
app.get('/api/cron/keep-alive', async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const userCount = await User.count();
    res.json({ status: 'ok', message: 'Base de datos activa', users: userCount });
});

// Rutas - Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/perfil', perfilRoutes);
app.use('/api/proveedores', proveedoresRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Inicialización del servidor
async function startServer() {
    try {
        await sequelize.authenticate();
        
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync();
        }

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

if (process.env.NODE_ENV !== 'production') {
    startServer();
}

module.exports = app;