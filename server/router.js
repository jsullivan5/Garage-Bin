const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/items', controller.getItems);
router.post('/items', controller.addItem);
router.patch('/items/:id', controller.updateItem);

module.exports = router;
