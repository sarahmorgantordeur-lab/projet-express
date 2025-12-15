const TodoModel = require('../models/todo.model');

class TodoService {

  // récupérer toutes les tâches
  static async getAllTodos() {
    return await TodoModel.findAll();
  }

  // Créer une tâche avec règle métier (on met jrs dans le service !!)
  static async createTodo(todo) {
    // Règle métier : titre obligatoire
    if (!todo || !todo.title || todo.title.trim() === '') {
      return null; // ou throw new Error("Titre requis");
    }

    return await TodoModel.create(todo);
  }
}

module.exports = TodoService;
