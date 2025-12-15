/**
 * Wrappe une fonction asynchrone pour capturer les erreurs
 * @param {Function} fn - Fonction asynchrone (contrôleur)
 * @returns {Function} Middleware Express
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise
            .resolve(fn(req, res, next))
            .catch(next); // Passe l'erreur au middleware global de gestion des erreurs
    };
};

module.exports = asyncHandler;
