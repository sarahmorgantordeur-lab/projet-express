const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true, // ⚠️ à désactiver en production
  logging: true,
  entities: [],
//   migrations: [],
//   subscribers: [],
});

module.exports = AppDataSource;
