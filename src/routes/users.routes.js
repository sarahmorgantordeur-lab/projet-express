const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { requireAuth, requireRole } = require('../middlewares/auth.middleware');

// // GET -> récupérer toutes les tâches
// router.get('/', UserController.getAllUsers);

// router.get('/:id', UserController.findById);

// // POST -> créer une nouvelle tâche
// router.post('/', UserController.createUser);

// router.delete('/:id', UserController.delete_user);

// 1. Route Profil (Tout le monde connecté) 
// Le middleware requireAuth va remplir req.user 
router.get('/profile', requireAuth, (req, res) => { 
    res.status(200).json(req.user); }); 
    
// 2. Route Admin (Seulement les Boss) 
// On enchaîne : D'abord on vérifie l'identité, PUIS le rôle 
router.get('/admin-dashboard', requireAuth, requireRole('ADMIN'), (req, res) => { 
    res.json({ message: "Bienvenue dans la zone secrète Admin" }); 
}); 
    
module.exports = router;