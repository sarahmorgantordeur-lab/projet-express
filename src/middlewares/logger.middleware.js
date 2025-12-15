// Middleware de log
const logger = (req, res, next) => {
    const start = Date.now(); // Stocke le temps de début

    // Événement qui se déclenche une fois la réponse envoyée
    res.on('finish', () => {
        const duration = Date.now() - start; // Calcul de la durée
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });

    next(); // Passe au middleware suivant ou à la route
};

module.exports = logger;
