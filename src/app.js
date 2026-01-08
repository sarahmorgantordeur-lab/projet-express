require('dotenv').config();
require('reflect-metadata');

const express = require('express');
const helmet = require('helmet');
const { globalLimiter } = require('./middlewares/rateLimiter');
const hpp = require('hpp');
const passport = require('passport');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./errors/errorHandler');

// ... Imports existants (express, passport, etc.)
const session = require('express-session');
const redis = require('./config/redis');// Notre fichier de config

// Lancement de la conexion Redis
require('./config/redis');

const app = express();
// Paser JSON
app.use(express.json());

// --- CONFIGURATION DE LA SESSION REDIS ---
app.use(session({
    // On remplace le store par défaut (Memory) par Redis
    store: new RedisStore({
        client: redis,
        prefix: "sess:", // Préfixe des clés dans Redis
    }),
    secret: 'votre_secret_super_securise',
    resave: false,
    saveUninitialized: false, //A changer, true c'est pour le test
    cookie: {
        secure: false, // false en HTTP (localhost)
        httpOnly: true, // Sécurité contre XSS
        maxAge: 86400*1000 //24 heures
    }
}));


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

// Sanitizer contre les attaques XSS
app.use(sanitizer);

// Protection contre la pollution de paramètres
// DOIT être placé APRES le body parser
app.use(hpp());

app.use(logger);

// --- PASSPORT ---
app.use(passport.initialize());
app.use(passport.session());
require ('./config/passport')(passport);

// --- ROUTES ---
const todoRoutes = require('./routes/todo.routes');
const userRoutes = require('./routes/users.routes');
const tagRoutes = require('./routes/tag.routes');
const authRoutes = require('./routes/auth.routes');


app.get('/messages', (req, res) => res.json(messages));
app.post('/messages', (req, res) => {
    // Écriture dans la session pour forcer la création
    req.session.lastMessage = new Date().toISOString();
    
    const { content } = req.body;
    messages.push({ content, date: new Date() });
    
    res.json({ 
        status: 'success',
        sessionId: req.sessionID,       // tu peux voir l'ID de session
        lastMessage: req.session.lastMessage
    });
});


app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/auth', authRoutes);


app.use(errorHandler);

module.exports = app;