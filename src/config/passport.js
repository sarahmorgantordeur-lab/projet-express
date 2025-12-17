const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt'); 
const LocalStrategy = require('passport-local').Strategy; 
const AppDataSource = require('./data-source');
const bcrypt = require('bcrypt');
const user = require('../models/user.entity');


// ... Importez bcrypt, AppDataSource et votre entité User ici 
module.exports = (passport) => { 
    // ===================================================== 
    // 1. STRATÉGIE LOCALE (Sert uniquement au Login) 
    // =====================================================
    passport.use(
        new LocalStrategy({ 
            usernameField: 'email', // Indiquez à Passport quel champ sert d'identifiant 
            session: false // Désactivez les sessions (car on fait une API REST) 
        },

        async (email, password, done) => {
            const userRepository = AppDataSource.getRepository('User');  // Récupérer le répository de user ou pas l'email ? on n'a pas déclaré user
            try {
                const user = await userRepository.findOneBy({ 'email': email });
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return done(null, false, { message: 'L\'email ou le mot de pass est incorrect.' });
                }
                return done(null, user);
            } catch (error) {
                return done(null, false, { message: 'L\'email ou le mot de pass est incorrect.' }); 
            }
    }
    ));

    // =====================================================
    // 2. STRATÉGIE JWT (Sert aux routes protégées) 
    // =====================================================

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Indiquez la clé secrète pour vérifier le token
        secretOrKey: process.env.JWT_SECRET || '123456', // Utilisez une variable d'environnement pour le secret
    };

    passport.use(
        new JwtStrategy(jwtOptions, async (payload, done) => {
            
            try {
                const userRepository = AppDataSource.getRepository('User');
                const user = await userRepository.findOneBy({ id: payload.id });

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }   
        })
    );
};