const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { auth} = require('../middlewares/auth');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);

module.exports = router;