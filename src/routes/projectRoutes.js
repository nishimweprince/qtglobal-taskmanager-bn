import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated'
import ProjectController from '../controllers/projectController'

// EXPRESS ROUTER
const router = express.Router()

// ROUTES

router.post('/', isAuthenticated, ProjectController.createProject)
router.get('/all', isAuthenticated, ProjectController.listAllProjects)
router.get('/', isAuthenticated, ProjectController.listUserProjects)

// EXPORT ROUTES
export default router
