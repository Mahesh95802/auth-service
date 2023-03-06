const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.connect().then(() => {
    console.log('Redis client connected');
});

const postJWTIntoRedis = async (key, value) => {
    return await redisClient.set(key, value);
}

const getJWTFromRedis = async (key) => {
    return await redisClient.get(key);
}

module.exports = { postJWTIntoRedis, getJWTFromRedis }