const AppDataSource = require('../config/data-source');

class TodoService {
    static get repository() {
        return AppDataSource.getRepository('Todo');
    }
    
    static get userRepository() {
        return AppDataSource.getRepository('User');
    }

    // récupérer toutes les users
    static async getAllTodos() {
        return await this.repository.find({ relations: ["user"] });
    }

    // Créer une tâche avec règle métier (on met jrs dans le service !!)
    static async createTodo(todo) {
        const user = await this.findById(todo.userId);
        if (!user) {
            throw new Error('User not found');
        }
        const newTodo = this.repository.create({
            title: todo.title,
            description: todo.description,
            user: user
        }); 
        return await this.repository.save(newTodo);
    }

    static async findById(id) {
        return await this.repository.findOneBy({ id });
    }
}

module.exports = TodoService;
