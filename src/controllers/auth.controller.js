const authService = require('../services/auth.service');
const HTTPError = require('../errors/HTTPError');

const register = async (req, res) => {
	try {
		// console.log("Register Controller", req.body)
		const response = await authService.register(req.body);
		res.status(201).json(response);
	} catch (err) {
		if (err instanceof HTTPError) return res.status(err.statusCode).json({ message: err.message });
		res.status(500).json({ message: err.message });
	}
};

const login = async (req, res) => {
	try {
		// console.log("Login Controller", req.body)
		const response = await authService.login(req.body);
		res.status(200).json(response);
	} catch (err) {
		if (err instanceof HTTPError) return res.status(err.statusCode).json({ message: err.message });
		res.status(500).json({ message: err.message });
	}
};

const verifyJWT = async (req, res) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		const response = await authService.verifyJWT(token);
		res.status(200).json(response);
	} catch (err) {
		if (err instanceof HTTPError) return res.status(err.statusCode).json({ message: err.message });
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { register, login, verifyJWT };