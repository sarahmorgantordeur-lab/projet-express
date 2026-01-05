const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/data-source');
const User = require('../models/user.entity');

const Repository = AppDataSource.getRepository(User);

const register = async (req, res) => {

    try { 
        // 1. Récupérer email, password, role depuis req.body 
        const { name, email, password, role } = req.body;
        // 2. Vérifier si l'utilisateur existe déjà (findOneBy email) 
        const existingUser = await Repository.findOneBy({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "L'utilisateur existe déjà." });
        } // -> Si oui : renvoyer une erreur 400 ou 409 

        // 3. Hacher le mot de passe (bcrypt.hash) avec un salt de 10 
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Créer l'instance de l'utilisateur (Repository.create) 
        const newUser = Repository.create({
            name: name,
            email: email,
            password: hashedPassword,  // -> Attention à mettre le mot de passe HACHÉ 
            role: role || 'USER'      // -> Si le rôle n'est pas fourni, forcer 'USER' par défaut
        });
        
        // 5. Sauvegarder (Repository.save) et répondre 201 
        await Repository.save(newUser);
        res.status(201).json({ message: "Utilisateur créé avec succès." });
        
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: "Server error !" }); 
    } 
};



// ========================================================
// 2. Fonction de login appelée après que le Passport Local ait vérifié le mot de passe
// ========================================================

const login = async (req, res) => { 
    // 1. Récupérer l'user validé par Passport 
    // INDICE : Il est disponible dans req.user 
    try {
    const { email, password } = req.body; 
    const foundUser = await Repository.findOneBy({ email: email });

    if (!foundUser) {
        return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    

    if (!isPasswordValid) {
        return res.status(401).json({ message: "Mot de passe incorrect." });
    }
    // 2. Préparer le Payload (les infos à mettre dans le token) 
    // -> id, email, role 

    const payload = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
    };

    // 3. Générer l'ACCESS Token (Court terme : 15 min) 
    // -> Utiliser jwt.sign(payload, secret, options) 
    const AccessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET || "123456",
      { expiresIn: "15m" }
    );

    // 4. Générer le REFRESH Token (Long terme : 7 jours)
    // -> Utiliser jwt.sign(payload, secret, options)
    const RefreshToken = jwt.sign(
      {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      },
      process.env.REFRESH_JWT_SECRET || "123456",
      { expiresIn: "7d" }
    );
    
    // 5. Renvoyer les deux tokens au client (JSON) 
    res.json({
        AccessToken, RefreshToken
    });
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: "Server error" }); 
    }
};


// ========================================================
// 2. Rafraichissement : vérifier que le RefreshToken est valide et redonner un Acesstoken neuf
// ========================================================

const refreshToken = async (req, res) => { 
    // 1. Récupérer le refreshToken depuis le body 
    // -> Si pas de token : erreur 401 
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401);
    }
    
    // 2. Vérifier le token (jwt.verify) 
    // -> Premier argument : le token 
    // -> Deuxième argument : le secret 
    // -> Troisième argument : le callback (err, decodedUser) 
    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, user) => { 

        // 3. Si erreur (token invalide ou expiré) : erreur 403
        if (err) {
            return res.status(403);
        } else {
            // 4. Si tout est bon : 
             // -> Re-créer un payload propre (id, email, role) depuis l'objet 'user' décodé 
            const newPayload = {
                id: user.id,
                email: user.email,
                role: user.role
            };
            const newAccessToken = jwt.sign(newPayload, process.env.JWT_SECRET, { expiresIn: '15m' }); // -> Signer un NOUVEL accessToken (15m) 
        
            // 5. Renvoyer l'accessToken (JSON) 
            res.json({ newAccessToken });
            }
    }); 
};

module.exports = {
    register,
    login,
    refreshToken
};