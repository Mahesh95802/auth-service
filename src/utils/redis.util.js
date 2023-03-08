const redis = require('redis');

const postJWTIntoRedis = async (key, value) => {
	const redisClient = redis.createClient({
		socket: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT
		}
	});
	redisClient.connect().then(() => {
		console.log('Redis client connected');
	});
	const status = await redisClient.set(key, value, 'PX', process.env.JWT_EXPIRY);
	redisClient.disconnect();
	return status;
};

const getJWTFromRedis = async (key) => {
	const redisClient = redis.createClient({
		socket: {
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT
		}
	});
	redisClient.connect().then(() => {
		console.log('Redis client connected');
	});
	const status = await redisClient.get(key);
	redisClient.disconnect();
	return status;
};

module.exports = { postJWTIntoRedis, getJWTFromRedis };