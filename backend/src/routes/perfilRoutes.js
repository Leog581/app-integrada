const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const { getPerfil } = require('../controllers/perfilController');
router.get('/', authenticate, getPerfil);
module.exports = router;
