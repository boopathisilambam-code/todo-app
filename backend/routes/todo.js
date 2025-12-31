const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/todos', authMiddleware, todoController.getTodos);
router.post('/todos', authMiddleware, todoController.addTodo);
router.delete('/todos/:id', authMiddleware, todoController.deleteTodo);
router.put('/todos/:id', authMiddleware, todoController.updateTodo);

module.exports = router;