import express from 'express';
import UserController from '../controllers/userController';
import isAuthenticated from '../middlewares/isAuthenticated';

// EXPRESS ROUTER
const router = express.Router();

// ROUTES

// CREATE USER
router.post('/auth/register', UserController.createUser);

// LOGIN USER
router.post('/auth/login', UserController.loginUser);

// UPDATE USER
router.patch('/', isAuthenticated, UserController.updateUser);

// UPDATE USER PASSWORD
router.patch('/password', isAuthenticated, UserController.changePassword)

// GET USER DETAILS
router.get('/', isAuthenticated, UserController.getUserDetails);

// EXPORT ROUTER
export default router;
