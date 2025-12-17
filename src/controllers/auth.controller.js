const bcrypt = require('bcrypt');
const jsonwetoken = require('jsonwebtoken');
const AppDataSource = require('../config/data-source');
const User = require('../models/user.entity');



const register = async (req, res) => { 
    try { 
        // 1. Récupérer email, password, role depuis req.body 
        const { email, password, role } = req.body;
        // 2. Vérifier si l'utilisateur existe déjà (findOneBy email) 
        const Repository = AppDataSource.getRepository(User);
        const existingUser = await Repository.findOneBy({ email: email });
        if (existingUser) {
            return res.status(409).json({ message: "L'utilisateur existe déjà." });
        } // -> Si oui : renvoyer une erreur 400 ou 409 

        // 3. Hacher le mot de passe (bcrypt.hash) avec un salt de 10 
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Créer l'instance de l'utilisateur (Repository.create) 
        const newUser = Repository.create({
            email: email,
            password: hashedPassword,  // -> Attention à mettre le mot de passe HACHÉ 
            role: role || 'USER'      // -> Si le rôle n'est pas fourni, forcer 'USER' par défaut
        });
        
        // 5. Sauvegarder (Repository.save) et répondre 201 
        await Repository.save(newUser);
        res.status(201).json({ message: "Utilisateur créé avec succès." });
        
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: "Server error" }); 
    } 
};