const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todo.controller');

// GET -> récupérer toutes les tâches
router.get('/', TodoController.getAllTodos);

// POST -> créer une nouvelle tâche
router.post('/', TodoController.createTodo);

module.exports = router;
