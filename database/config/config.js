require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DB_DEV_USER,
		password: process.env.DB_DEV_PASS,
		database: process.env.DB_DEV_NAME,
		host: process.env.DB_DEV_HOST,
		dialect: 'postgres',
		port: process.env.DB_DEV_PORT
	},
	test: {
		username: process.env.DB_TEST_USER,
		password: process.env.DB_TEST_PASS,
		database: process.env.DB_TEST_NAME,
		host: process.env.DB_TEST_HOST,
		dialect: 'postgres',
		port: process.env.DB_TEST_PORT
	},
};
