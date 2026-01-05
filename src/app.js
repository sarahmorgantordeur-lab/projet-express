require('reflect-metadata');
// require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const { globalLimiter } = require('./middlewares/rateLimiter');
const hpp = require('hpp');
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
        if (
            whitelist.includes(origin) ||
            origin === 'null' ||   // ← pour file://
            !origin  // !origin signifie requête server à server (Postman, curl) 
            ) { 
                callback(null, true);      
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT'], // verbes autorisés
    allowedHeaders: ['Content-Type', 'Authorization'] // headers autorisés
};

// Stockage temporaire en mémoire (pour la démo)
const messages = [];

const sanitizer = require('./middlewares/sanitizer');

// Activer CORS avec les options définies (application du middleware)
app.use(cors(corsOptions));

// Limiteur global
app.use(globalLimiter);

// Paser JSON
app.use(express.json());


// Sanitizer contre les attaques XSS
app.use(sanitizer);

// Protection contre la pollution de paramètres
// DOIT être placé APRES le body parser
app.use(hpp());

app.use(logger);
// Initialiser passport 
app.use(passport.initialize());
require ('./config/passport')(passport);

// Routes

const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/users.routes');
const tagRoutes = require('./routes/tag.routes');
const authRoutes = require('./routes/auth.routes');


app.get('/messages', (req, res) => res.json(messages));
app.post('/messages', (req, res) => {
    // Faille : On stocke directement ce qu'on reçoit sans nettoyer
    const { content } = req.body;
    messages.push({ content, date: new Date() });
    res.json({ status: 'success' });
});


app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/auth', authRoutes);


app.use(errorHandler);

module.exports = app;
