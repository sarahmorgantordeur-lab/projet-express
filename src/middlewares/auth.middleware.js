const passport = require('passport');

// On demande à Passport d'utiliser la stratégie 'jwt' sans session cookie 
const requireAuth = passport.authenticate('jwt', { session: false });

//Le filtre rôle pour vérifier si admin ou user
const requireRole = (role) => { 
    
    return (req, res, next) => { 
    // 1. req.user contient l'utilisateur connecté (grâce à requireAuth avant) 
    // Si pas d'user (cas rare mais possible), renvoyer 401. 
    if (!req.user) { 
        return res.status(401).json({ message: "Utilisateur non authentifié" }); 
    }

    // 2. Comparer req.user.role avec le 'role' demandé en argument 
    // -> Si ça ne matche pas : 
    // Renvoyer une erreur 403 (Forbidden) avec message "Droits insuffisants" 
    if (req.user.role !== role) { 
        return res.status(403).json({ message: "Droits insuffisants" }); 
    }
    // 3. Si tout est bon : 
    // Appeler next() pour laisser passer 
    next();
    }; 
}; 

module.exports = { requireAuth, requireRole };