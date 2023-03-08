const authController = require('../../src/controllers/auth.controller');
const authService = require('../../src/services/auth.service');
const HTTPError = require('../../src/errors/HTTPError');

describe('Auth Controller', () => {
    describe('Register Controller', () => {
        it('Should return 201 if user is registered', async () => {
            const mockReq = {
                body: {
                    email: '',
                    password: 'password'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'register').mockResolvedValue({
                user: { id: 1, email: 'example@exmaple.com' },
                accessToken: 'JWT'
            });
            await authController.register(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.status().json).toHaveBeenCalledWith({
                user: { id: 1, email: 'example@exmaple.com' },
                accessToken: 'JWT'
            });
        });
        it('Should return HTTP Error if authService throws HTTPError', async () => {
            const mockReq = {
                body: {
                    email: 'example@exmaple.com',
                    password: 'password'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'register').mockRejectedValue(new HTTPError(400, 'Bad Request'));
            await authController.register(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.status().json).toHaveBeenCalledWith({ message: 'Bad Request' });
        });
        it('Should return Error if authService throws Error', async () => {
            const mockReq = {
                body: {
                    email: 'example@exmaple.com',
                    password: 'password'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'register').mockRejectedValue(new Error());
            await authController.register(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });
    describe('Login Controller', () => {
        it('Should return 200 if user is logged in', async () => {
            const mockReq = {
                body: {
                    email: 'example@example.com',
                    password: 'password'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'login').mockResolvedValue({
                user: { id: 1, email: 'example@exmaple.com' },
                accessToken: 'JWT'
            });
            await authController.login(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.status().json).toHaveBeenCalledWith({
                user: { id: 1, email: 'example@exmaple.com' },
                accessToken: 'JWT'
            });
        });
        it('Should return HTTP Error if authService throws HTTPError', async () => {
            const mockReq = {
                body: {
                    email: 'example@example.com',
                    password: 'password'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'login').mockRejectedValue(new HTTPError(400, 'Bad Request'));
            await authController.login(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.status().json).toHaveBeenCalledWith({ message: 'Bad Request' });
        });
        it('Should return Error if authService throws Error', async () => {
            const mockReq = {
                body: {
                    email: 'example@example.com',
                    password: 'password'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'login').mockRejectedValue(new Error());
            await authController.login(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });
    describe('Verify JWT Controller', () => {
        it('Should return 200 if JWT is verified', async () => {
            const mockReq = {
                headers: {
                    authorization: 'Bearer JWT'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'verifyJWT').mockResolvedValue({ id: 1 });
            await authController.verifyJWT(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.status().json).toHaveBeenCalledWith({ id: 1 });
        });
        it('Should return HTTP Error if authService throws HTTPError', async () => {
            const mockReq = {
                headers: {
                    authorization: 'Bearer JWT'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'verifyJWT').mockRejectedValue(new HTTPError(400, 'Bad Request'));
            await authController.verifyJWT(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.status().json).toHaveBeenCalledWith({ message: 'Bad Request' });
        });
        it('Should return Error if authService throws Error', async () => {
            const mockReq = {
                headers: {
                    authorization: 'Bearer JWT'
                }
            };
            const mockRes = {
                status: jest.fn().mockReturnValue({ json: jest.fn() })
            };
            jest.spyOn(authService, 'verifyJWT').mockRejectedValue(new Error());
            await authController.verifyJWT(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(500);
        });
    });
});