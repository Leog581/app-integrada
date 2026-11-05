const express = require('express');
const router = express.Router();
const { authenticate, adminOnly } = require('../middlewares/authMiddleware');
const { getItems, createItem, updateItem, deleteItem } = require('../controllers/itemsController');

router.use(authenticate, adminOnly);
router.get('/', getItems);
router.post('/', createItem);
router.patch('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
