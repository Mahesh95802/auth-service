const Joi = require('joi');
const jwt = require('jsonwebtoken');
const redisUtil = require('../utils/redis.util');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const loginValidator = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error);
    }
    next();
}

const registerValidator = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error);
    }
    next();
}

const JWTValidator = async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    return jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if(err) return res.sendStatus(401);
        const redisJWT = await redisUtil.getJWTFromRedis(token);
        if (!redisJWT) return res.sendStatus(401);
        // console.log(user)
        return res.status(200).json(user)
    });
}

module.exports = { loginValidator, registerValidator, JWTValidator }