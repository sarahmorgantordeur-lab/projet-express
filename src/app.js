require('reflect-metadata');
require('dotenv').config();

const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/users.routes');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);
console.log('coucou')

app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
