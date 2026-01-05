const rateLimit = require('express-rate-limit');


// 1. Limiteur Global (Protection DoS basique)
// S'applique à toutes les routes
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    message: {
        status: 429,
        error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
    },
    standardHeaders: true, // Retourne les infos de limite dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
});

// 2. Limiteur Strict (Protection Force Brute)
// S'applique uniquement aux routes sensibles (Login/Register)
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // Fenêtre de 1 heure
    max: 10, // Limite drastique : 10 tentatives par heure max
    message: {
        status: 429,
        error: 'Trop de tentatives de connexion. Compte temporairement bloqué.'
    }
});

module.exports = { globalLimiter, authLimiter };