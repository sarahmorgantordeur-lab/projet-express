const AppDataSource = require('../config/data-source');

class UserService {
    static get repository() {
        return AppDataSource.getRepository('User');
    }

    // récupérer toutes les users
    static async getAllUsers() {
        return await this.repository.find();
    }

    // Créer une tâche avec règle métier (on met jrs dans le service !!)
    static async createUser(user) {
        const newUser = this.repository.create(user); 
        return await this.repository.save(newUser);
    }

    static async findById(id) {
        return await this.repository.findOneBy({ id });
    }
}

module.exports = UserService;
