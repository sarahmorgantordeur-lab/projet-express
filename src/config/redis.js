const { createClient } = require('redis');

// Docker injecte "redis" dans REDIS_HOST
// Si on lance en local sans Docker, on fallback sur "localhost"
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;

console.log(`Initialisation Redis vers : ${redisHost}:${redisPort}`);

// Création de l'instance de connexion
const redis = createClient({
    socket: {
        host: redisHost,
        port: redisPort,
    }
});

// Ecouteurs pour le débogage
redis.on('connect', () => {
    console.log('Redis: Connexion réussie !');
});

redis.on('error', (err) => {
    console.error('Redis: Erreur de connexion -', err);
});

// Connexion au serveur Redis (node-redis v4 nécessite connect())
redis.connect().catch(console.error);

module.exports = redis;