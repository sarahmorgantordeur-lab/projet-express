require('reflect-metadata');
// require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/users.routes');
const tagRoutes = require('./routes/tag.routes');
const authRoutes = require('./routes/auth.routes');
const passport = require('passport');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');

const app = express();

//--- SECURITE ---
app.use(helmet()); //masque les technologie et ajoute les headers de sécurité

const cors = require('cors');

//liste des domaines utilisés
const whitelist = [ 'http://localhost:4200', 'http://localhost:3000', 'http://localhost:5500' ];
const corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);      
        } else if (!origin) { // !origin signifie requête server à server (Postman, curl) 
            callback(null, true);      
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT'], // verbes autorisés
    allowedHeaders: ['Content-Type', 'Authorization'] // headers autorisés
};

// Activer CORS avec les options définies (application du middleware)
app.use(cors(corsOptions));

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
