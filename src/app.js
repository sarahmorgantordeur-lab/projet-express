require('reflect-metadata');
// require('dotenv').config();

const express = require('express');
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/users.routes');
const tagRoutes = require('./routes/tag.routes');
const authRoutes = require('./routes/auth.routes');
const passport = require('passport');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');

const app = express();

app.use(express.json());
app.use(logger);
// Initialiser passport 
app.use(passport.initialize());
require ('./config/passport')(passport);


app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
