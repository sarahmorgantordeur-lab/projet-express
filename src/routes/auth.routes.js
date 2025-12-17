const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);

router.post('/login', passport.authenticate('local', { session: false }), authController.login);

module.exports = router;
