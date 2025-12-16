const { DataSource } = require("typeorm");
const UserSchema = require("../models/user.entity");
const TodoSchema = require("../models/todo.entity");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // ⚠️ à désactiver en production
  logging: true,
  entities: [UserSchema, TodoSchema],
//   migrations: [],
//   subscribers: [],
});

module.exports = AppDataSource;
