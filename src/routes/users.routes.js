const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// GET -> récupérer toutes les tâches
router.get('/', UserController.getAllUsers);

// POST -> créer une nouvelle tâche
router.post('/', UserController.createUser);


module.exports = router;