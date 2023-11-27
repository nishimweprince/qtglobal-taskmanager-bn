import express from 'express';
import userRoutes from './userRoutes';

// EXPRESS ROUTER
const router = express.Router();

// ROUTES
router.use('/users', userRoutes);

// EXPORT ROUTER
export default router;
