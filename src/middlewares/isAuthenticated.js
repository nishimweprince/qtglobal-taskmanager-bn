import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENVIRONMENT VARIABLES
const { JWT_SECRET } = process.env;

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token || token === 'null') {
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        const { id, email } = jwt.verify(token, JWT_SECRET);

        req.user = { id, email };

        return next();
    } catch (error) {
        return res.status(500).json({
            message: error?.message
        })
    }
};

export default isAuthenticated;
