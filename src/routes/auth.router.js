const authRouter = require('express').Router();

const authController = require('../controllers/auth.controller');
const authValidator = require('../middlewares/auth.validator');

authRouter.post('/register', authValidator.registerValidator, authController.register);

authRouter.post('/login', authValidator.loginValidator, authController.login);

authRouter.get('/validate', authValidator.JWTValidator)

module.exports = authRouter;