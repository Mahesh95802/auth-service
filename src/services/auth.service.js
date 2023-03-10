const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisUtil = require('../utils/redis.util');
const { Auth } = require('../models');
const HTTPError = require('../errors/HTTPError');

const register = async (body) => {
	const { email, password } = body;
	const user = await Auth.findOne({ where: { email } });
	if (user) throw new HTTPError(400, 'Email already in use');
	const passwordHash = await bcrypt.hash(password, 10);
	const createdUser = await Auth.create({ email, password: passwordHash });
	const accessToken = jwt.sign({ id: createdUser.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
	const redisJWT = await redisUtil.postJWTIntoRedis(accessToken, createdUser.id);
	if (!redisJWT) throw new HTTPError(500, 'Error while saving JWT in Redis');
	return {
		user: {
			id: createdUser.id,
			email: createdUser.email
		},
		accessToken
	};
};

const login = async (body) => {
	const { email, password } = body;
	const user = await Auth.findOne({ where: { email } });
	if (!user) throw new HTTPError(401, 'Invalid credentials');
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new HTTPError(401, 'Invalid credentials');
	const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRY}ms` });
	const redisJWT = await redisUtil.postJWTIntoRedis(accessToken, user.id);
	// console.log('Redis JWT', redisJWT);
	if (!redisJWT) throw new HTTPError(500, 'Error while saving JWT in Redis');
	return {
		user: {
			id: user.id,
			email: user.email
		},
		accessToken
	};
};

const verifyJWT = async (token) => {
	if (!token) throw new HTTPError(401, 'Invalid JWT');
	const user = jwt.verify(token, process.env.JWT_SECRET);
	const redisJWT = await redisUtil.getJWTFromRedis(token);
	if (!redisJWT) throw new HTTPError(401, 'Invalid JWT');
	return user;
	// return jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
	// 	if(err) throw new HTTPError(401, 'Invalid JWT');
	// 	const redisJWT = await redisUtil.getJWTFromRedis(token);
	// 	if (!redisJWT) throw new HTTPError(401, 'Invalid JWT');
	// 	// console.log(user)
	// 	return user;
	// });
};

module.exports = { register, login, verifyJWT };