const TodoService = require('../services/todo.service');
const asyncHandler = require('../utils/asyncHandler');

// Récupérer toutes les tâches
exports.getAll = asyncHandler(async (req, res) => {
    const todos = await TodoService.getAllTodos();
    res.json(todos);
});

// Créer une nouvelle tâche
exports.create = asyncHandler(async (req, res) => {
    const newTodo = await TodoService.createTodo(req.body);

    if (!newTodo) {
        return res.status(400).json({ error: 'Le titre de la tâche est obligatoire' });
    }

    res.status(201).json(newTodo);
});
