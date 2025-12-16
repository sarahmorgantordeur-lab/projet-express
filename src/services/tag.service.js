const AppDataSource = require('../config/data-source');

class TagService {
    static get repository() {
        return AppDataSource.getRepository('Tag');
    }

    // // récupérer tous les tags
    // static async getAllTags() {
    //     return await this.repository.find({ relations: ["todo"] });
    // }

    // static async createTag(tag) {
    //     const newTag = this.repository.create({
    //         label: tag.label 
    //     }); 
    //     return await this.repository.save(newTag);
    // }

    static async findByIds(ids) {
        return await this.repository.findAll({ id });
    }
}

module.exports = TagService;
