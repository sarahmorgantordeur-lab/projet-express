const express = require('express');
const todoRoutes = require('./routes/todo.routes');

const app = express();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Monte le routeur sur le préfixe /api/todos
app.use('/api/todos', todoRoutes);

module.exports = app;
