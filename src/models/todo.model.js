class TodoModel {
  // tableau en mémoire
  static todos = [
    { id: 1, title: "Faire les courses", completed: false }
  ];

  // retourne toutes les tâches
  static findAll() {
    return new Promise((resolve) => {
      resolve(this.todos);
    });
  }

  // nouvelle tâche
  static create(todo) {
    return new Promise((resolve) => {
      const newTodo = {
        id: this.todos.length + 1,
        title: todo.title,
        completed: false
      };

      this.todos.push(newTodo);
      resolve(newTodo);
    });
  }
}

module.exports = TodoModel;
