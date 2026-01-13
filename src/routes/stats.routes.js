const express = require('express');
const router = express.Router();
const cache = require('../middlewares/cache.middleware');
const redis = require('../config/redis');

const fakeSalesData = {
    totalSales: 150000,
    topProducts: "Café",
    lastUpdated: new Date()
};

router.get('/stats', cache(60), async (req, res) => {

    await new Promise(resolve => setTimeout(resolve, 2000));

    res.json({
        ...fakeSalesData,
        generatedAt: new Date().toISOString()
    });
});

// Route POST pour ajouter une vente et invalider le cache
router.post('/sales', async (req, res) => {
    try {
        const { amount, product } = req.body;

        // 1. Mettre à jour les données de vente
        if (amount) {
            fakeSalesData.totalSales += amount;
        }
        if (product) {
            fakeSalesData.topProducts = product;
        }
        fakeSalesData.lastUpdated = new Date();

        // 2. Supprimer la clé Redis pour invalider le cache
        const cacheKey = 'cache:/api/stats';
        await redis.del(cacheKey);
        console.log('🗑️  Cache invalidé pour:', cacheKey);

        // 3. Renvoyer la confirmation
        res.status(201).json({
            message: 'Vente ajoutée avec succès et cache invalidé',
            newTotalSales: fakeSalesData.totalSales,
            topProducts: fakeSalesData.topProducts,
            lastUpdated: fakeSalesData.lastUpdated
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la vente:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;