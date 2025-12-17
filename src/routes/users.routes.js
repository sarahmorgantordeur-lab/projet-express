const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');

// GET -> récupérer toutes les tâches
router.get('/', UserController.getAllUsers);

router.get('/:id', UserController.findById);

// POST -> créer une nouvelle tâche
router.post('/', UserController.createUser);

router.delete('/:id', UserController.delete_user);


module.exports = router;