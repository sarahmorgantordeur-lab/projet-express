const AppDataSource = require('../config/data-source');

class UserService {

  // récupérer toutes les tâches
  static async getAllUsers() {
            console.log('coucou')
    return await AppDataSource.findAll();
  }

  // Créer une tâche avec règle métier (on met jrs dans le service !!)
  static async createUser(user) {
    // Règle métier : nom obligatoire
    if (!user || !user.name || user.name.trim() === '') {
      return null; // ou throw new Error("Nom requis");
    }

    return await AppDataSource.create(user);
  }
}

module.exports = UserService;
