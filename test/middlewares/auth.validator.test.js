/* eslint-disable no-undef */
const authValidator = require('../../src/middlewares/auth.validator');

describe('Auth Validator', () => {
	describe('Register Validator', () => {
		it('Should call next if all fields are provided', async () => {
			const mockReq = {
				body: {
					email: 'email@example.com',
					password: 'password'
				}
			};
			const mockRes = {
				status: jest.fn().mockReturnValue({ json: jest.fn() })
			};
			const mockNext = jest.fn();
			await authValidator.registerValidator(mockReq, mockRes, mockNext);
			expect(mockNext).toHaveBeenCalled();
		});
		it('Should return an error if email is not provided', async () => {
			const mockReq = {
				body: {
					email: '',
					password: 'password'
				}
			};
			const mockRes = {
				status: jest.fn().mockReturnValue({ json: jest.fn() })
			};
			const mockNext = jest.fn();
			await authValidator.registerValidator(mockReq, mockRes, mockNext);
			expect(mockRes.status).toHaveBeenCalledWith(400);
		});
	});
	describe('Login Validator', () => {
		it('Should call next if all fields are provided', async () => {
			const mockReq = {
				body: {
					email: 'email@example.com',
					password: 'password'
				}
			};
			const mockRes = {
				status: jest.fn().mockReturnValue({ json: jest.fn() })
			};
			const mockNext = jest.fn();
			await authValidator.loginValidator(mockReq, mockRes, mockNext);
			expect(mockNext).toHaveBeenCalled();
		});
		it('Should return an error if email is not provided', async () => {
			const mockReq = {
				body: {
					email: '',
					password: 'password'
				}
			};
			const mockRes = {
				status: jest.fn().mockReturnValue({ json: jest.fn() })
			};
			const mockNext = jest.fn();
			await authValidator.loginValidator(mockReq, mockRes, mockNext);
			expect(mockRes.status).toHaveBeenCalledWith(400);
		});
	});
    
});
    