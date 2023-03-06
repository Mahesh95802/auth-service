const authService = require('../services/auth.service');

const register = async (req, res) => {
    try{
        console.log("Register Controller", req.body)
        const response = await authService.register(req.body);
        res.status(201).json(response);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try{
        console.log("Login Controller", req.body)
        const response = await authService.login(req.body);
        res.status(200).json(response);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { register, login }