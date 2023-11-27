const dotenv = require('dotenv');

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENV VARIABLES
const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

// EXPORT CONFIG
module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT,
    host: DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: false,
    },
  },
};
