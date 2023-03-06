const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisUtil = require('../utils/redis.util');
const { Auth } = require('../models');

const register = async (body) => {
    const { email, password } = body;
    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = await Auth.create({ email, password: passwordHash });
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const redisJWT = await redisUtil.postJWTIntoRedis(accessToken, createdUser.id);
    if (!redisJWT) throw new Error('Error while saving JWT in Redis');
    console.log('Redis JWT', redisJWT)
    return {
        user: {
            id: createdUser.id,
            email: createdUser.email
        },
        accessToken
    }
}

const login = async (body) => {
    const { email, password } = body;
    const user = await Auth.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const redisJWT = await redisUtil.postJWTIntoRedis(accessToken, user.id);
    console.log('Redis JWT', redisJWT)
    if (!redisJWT) throw new Error('Error while saving JWT in Redis');
    return {
        user: {
            id: user.id,
            email: user.email
        },
        accessToken
    }
}

module.exports = { register, login }