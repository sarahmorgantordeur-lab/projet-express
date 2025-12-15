const TodoService = require('../services/todo.service');

class TodoController {

  // Récupérer toutes les tâches
  static async getAllTodos(req, res) {
    try {
      const todos = await TodoService.getAllTodos();
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: 'Impossible de récupérer les tâches' });
    }
  }

  // Créer une nouvelle tâche
  static async createTodo(req, res) {
    try {
      const newTodo = await TodoService.createTodo(req.body);

      if (!newTodo) {
        return res.status(400).json({ error: 'Le titre de la tâche est obligatoire' });
      }

      res.status(201).json(newTodo);
    } catch (error) {
      res.status(500).json({ error: 'Impossible de créer la tâche' });
    }
  }
}

module.exports = TodoController;
