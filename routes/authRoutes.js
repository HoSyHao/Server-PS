const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const verifyToken = require('../middlewares/auth');

router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password/:token', AuthController.resetPassword);
router.get('/me', verifyToken, AuthController.getAuthenticatedUser);

module.exports = router;