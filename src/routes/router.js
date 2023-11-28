import express from 'express';
import userRoutes from './userRoutes';
import taskRoutes from './taskRoutes';
import projectRoutes from './projectRoutes';

// EXPRESS ROUTER
const router = express.Router();

// ROUTES
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);

// EXPORT ROUTER
export default router;
