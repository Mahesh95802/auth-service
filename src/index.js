require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

const authRouter = require('./routes/auth.router');

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.listen(PORT, () => {
	console.log(`Auth Server started on port: ${PORT}`);
});