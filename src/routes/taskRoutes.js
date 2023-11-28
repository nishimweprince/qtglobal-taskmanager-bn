import express from 'express';
import multer from 'multer'
import TaskController from '../controllers/taskController';
import isAuthenticated from '../middlewares/isAuthenticated';

// EXPRESS ROUTER
const router = express.Router();

// SETUP MULTER
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

// ROUTES
router.post('/', isAuthenticated, upload.array('files'), TaskController.createTask);
router.get('/all', isAuthenticated, TaskController.listAllTasks);
router.get('/', isAuthenticated, TaskController.listUserTasks);
router.get('/:id', isAuthenticated, TaskController.getTaskDetails);

// EXPORT ROUTER
export default router;
