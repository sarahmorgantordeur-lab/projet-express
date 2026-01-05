const validate = (schema) => {
    // Retourne un middleware Express standard (req, res, next)
    return (req, res, next) => {
    try {
        
        // 1. Parsing et Validation
        // La méthode .parse() lance une exception si les données sont invalides.
        // Elle retourne également les données "nettoyées" (sans champs inconnus).
        req.body = schema.parse(req.body);

        // 2. Succès : Passage au middleware suivant
        next();
    } catch (error) {

        // 3. Échec : Interruption de la requête
        return res.status(400).json({
            status: 'error',
            message: 'Données invalides',
            errors: error.errors
        });
    }
    };  
};

module.exports = validate;
