/* eslint-disable no-undef */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisUtil = require('../../src/utils/redis.util');
const { Auth } = require('../../src/models');
const HTTPError = require('../../src/errors/HTTPError');
const authService = require('../../src/services/auth.service');

describe('Auth Service', () => {
	describe('Register', () => {
		it('Should create a new user and return a JWT', async () => {
			jest.spyOn(Auth, 'findOne').mockResolvedValue(null);
			jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
			jest.spyOn(Auth, 'create').mockResolvedValue({
				id: 1,
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			});
			jest.spyOn(jwt, 'sign').mockReturnValue('JWT');
			jest.spyOn(redisUtil, 'postJWTIntoRedis').mockResolvedValue(true);
			const result = await authService.register({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			});
			expect(result).toEqual({
				user: { id: 1, email: 'example@exmaple.com' },
				accessToken: 'JWT'
			});
		});
		it('Should return an HTTPError if email is already in use', async () => {
			jest.spyOn(Auth, 'findOne').mockResolvedValue({ id: 1 });
			await expect(authService.register({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			})).rejects.toThrow(HTTPError);
		});
		it('Should return an HTTPError if JWT is not saved in Redis', async () => {
			jest.spyOn(Auth, 'findOne').mockResolvedValue(null);
			jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
			jest.spyOn(Auth, 'create').mockResolvedValue({
				id: 1,
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			});
			jest.spyOn(jwt, 'sign').mockReturnValue('JWT');
			jest.spyOn(redisUtil, 'postJWTIntoRedis').mockResolvedValue(false);
			await expect(authService.register({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			})).rejects.toThrow(HTTPError);
		});
		it('Should return an Error if there is an DB error', async () => {
			jest.spyOn(Auth, 'findOne').mockRejectedValue(new Error());
			await expect(authService.register({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			})).rejects.toThrow(new Error());
		});
	});
	describe('Login', () => {
		it('Should return a JWT with user if credentials are correct', async () => {
			jest.spyOn(Auth, 'findOne').mockResolvedValue({
				id: 1,
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			});
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
			jest.spyOn(jwt, 'sign').mockReturnValue('JWT');
			jest.spyOn(redisUtil, 'postJWTIntoRedis').mockResolvedValue(true);
			const result = await authService.login({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			});
			expect(result).toEqual({
				user: { id: 1, email: 'example@exmaple.com' },
				accessToken: 'JWT'
			});
		});
		it('Should return an HTTPError if user is not found', async () => {
			jest.spyOn(Auth, 'findOne').mockResolvedValue(null);
			await expect(authService.login({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			})).rejects.toThrow(HTTPError);
		});
		it('Should return an HTTPError if password is incorrect', async () => {
			jest.spyOn(Auth, 'findOne').mockResolvedValue({
				id: 1,
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			});
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
			await expect(authService.login({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			})).rejects.toThrow(HTTPError);
		});
		it('Should return an HTTPError if JWT is not saved in Redis', async () => {
			jest.spyOn(Auth, 'findOne').mockResolvedValue({
				id: 1,
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			});
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
			jest.spyOn(jwt, 'sign').mockReturnValue('JWT');
			jest.spyOn(redisUtil, 'postJWTIntoRedis').mockResolvedValue(false);
			await expect(authService.login({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			})).rejects.toThrow(HTTPError);
		});
		it('Should return an Error if there is an DB error', async () => {
			jest.spyOn(Auth, 'findOne').mockRejectedValue(new Error());
			await expect(authService.login({
				email: 'example@exmaple.com',
				password: 'hashedPassword'
			})).rejects.toThrow(new Error());
		});
	});
	describe('Verify JWT', () => {
		it('Should return a user if JWT is valid', async () => {
			jest.spyOn(jwt, 'verify').mockReturnValue({ id: 1 });
			jest.spyOn(redisUtil, 'getJWTFromRedis').mockResolvedValue('JWT');
			expect(await authService.verifyJWT('JWT')).toEqual({ id: 1 });
		});
		it('Should return an HTTPError if token is null', async () => {
			await expect(authService.verifyJWT(null)).rejects.toThrow(HTTPError);
		});
		it('Should return an HTTPError if JWT is invalid', async () => {
			jest.spyOn(jwt, 'verify').mockRejectedValue(new Error());
			await expect(authService.verifyJWT('JWT')).rejects.toThrow(new Error());
		});
		it('Should return an HTTPError if JWT is not found in Redis', async () => {
			jest.spyOn(jwt, 'verify').mockReturnValue({ id: 1 });
			jest.spyOn(redisUtil, 'getJWTFromRedis').mockResolvedValue(null);
			await expect(authService.verifyJWT('JWT')).rejects.toThrow(HTTPError);
		});
	});
});