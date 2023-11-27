import express from 'express';
import 'core-js/stable/index.js';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../models/index.js'
import router from './routes/router.js';

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENVIRONMENT VARIABLES
const { PORT, DB_NAME } = process.env;

// CREATE EXPRESS APP
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api', router);

// INITIATE SERVER
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// INITIATE DATABASE
const dbCon = async () => {
    try {
        await db.sequelize.authenticate();
        console.log(`Database ${DB_NAME} connected successfully`);
    } catch (error) {
        console.log(error);
    }
};

// START SERVER
Promise.all([server, dbCon()]).catch((error) => {
    console.log(`Server error: ${error.message}`);
});

// EXPORT SERVER
export default app;