const redis = require('../config/redis');

const cache = (duration) => {
    return async (req, res, next) => {
        const key = `cache:${req.originalUrl || req.url}`;

        try {
            const cachedData = await redis.get(key);

            if (cachedData) {
                console.log('✅ Cache HIT pour:', key);
                return res.status(200).json(JSON.parse(cachedData));
            }

            console.log('❌ Cache MISS pour:', key);

            const originalJson = res.json;
            res.json = (body) => {
                res.json = originalJson;
                // Redis v5 utilise setEx pour définir une clé avec expiration
                redis.setEx(key, duration, JSON.stringify(body)).catch(err => {
                    console.error('❌ Erreur lors de la mise en cache:', err);
                });
                console.log('💾 Données mises en cache pour:', key, `(${duration}s)`);
                return originalJson.call(res, body);
            };

            next();
        } catch (error) {
            console.error('❌ Erreur dans le middleware de cache:', error);
            next();
        }
    };
};

module.exports = cache;