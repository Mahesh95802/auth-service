// const redis = require('redis-mock');
const redis = require('redis');
const redisUtil = require('../../src/utils/redis.util');


// jest.mock('redis')

jest.mock('../../src/utils/redis.util')

// redis.mockImplementation(() => {
//     return redis.createClient().mockImplementation(() => {
//         return {
//             connect: jest.fn().mockResolvedValue('Connected'),
//             set: jest.fn().mockResolvedValue('OKK'),
//             get: jest.fn().mockResolvedValue('JWTT')
//         };
//     })
// });

describe('Redis Util', () => {
    describe('postJWTIntoRedis', () => {
        it('it should return OK if JWT is saved in Redis', async () => {
            const mockRedisClient = {
                connect: jest.fn().mockResolvedValue('Connected'),
                set: jest.fn().mockResolvedValue('OKK')
            };
            jest.spyOn(redis, 'createClient').mockResolvedValue(mockRedisClient);
            // jest.spyOn(redis, 'connect').mockResolvedValue('Connected');
            // jest.spyOn(redis, 'postJWTIntoRedis').mockResolvedValue('OK');
            const result = await redisUtil.postJWTIntoRedis('JWT', 1);
            expect(result).toEqual('OKK');
        });
        it('should throw error if Redis fails', async () => {
            const mockRedisClient = {
                connect: jest.fn().mockRejectedValue(new Error()),
                set: jest.fn().mockResolvedValue('OKK')
            };
            jest.spyOn(redis, 'createClient').mockResolvedValue(mockRedisClient);
            // jest.spyOn(redis, 'createClient').mockResolvedValue('created');
            // jest.spyOn(redis, 'connect').mockResolvedValue('Connected');
            // jest.spyOn(redis, 'postJWTIntoRedis').mockResolvedValue('OK');
            await expect(redisUtil.postJWTIntoRedis('JWT', 1)).rejects.toThrow(new Error());
        });
    });
});