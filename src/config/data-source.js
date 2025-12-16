const { DataSource } = require("typeorm");
const UserSchema = require("../models/user.entity");
const TodoSchema = require("../models/todo.entity");
const TagSchema = require("../models/tags.entity");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // ⚠️ à désactiver en production
  logging: true,
  entities: [UserSchema, TodoSchema, TagSchema],
//   migrations: [],
//   subscribers: [],
});

module.exports = AppDataSource;
