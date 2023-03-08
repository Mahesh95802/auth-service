const Joi = require('joi');

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
};

const registerValidator = (req, res, next) => {
	const { error } = registerSchema.validate(req.body);
	if (error) {
		return res.status(400).json(error);
	}
	next();
};

module.exports = { loginValidator, registerValidator };