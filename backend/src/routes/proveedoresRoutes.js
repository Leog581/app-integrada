const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { searchProveedores } = require('../controllers/proveedoresController');
router.get('/', authenticate, searchProveedores);
module.exports = router;
