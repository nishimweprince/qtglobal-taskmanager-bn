import dotenv from 'dotenv';
import db from '../../models/index.js'
import { getPagination, getPagingData } from '../helpers/pagination.js';

// CONFIGURE DOTENV
dotenv.config();

// LOAD MODELS
const { project, task, user } = db;

class ProjectController {
    // CREATE PROJECT
    static async createProject(req, res) {
        try {
            const { title, description } = req.body;

            const { user: { id } } = req;

            const projectExists = await project.findOne({
                where: { title, id }
            });

            if (projectExists) {
                return res.status(409).json({
                    message: 'Project already exists'
                })
            }

            const newProject = await project.create({
                title,
                user_id: id,
                description
            })

            return res.status(201).json({
                message: 'Success',
                data: newProject
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // LIST ALL PROJECTS
    static async listAllProjects(req, res) {
        try {
            const { page, size } = req.query;

            const { limit, offset } = getPagination(page, size);
            const projectsList = await project.findAndCountAll({
                include: [{
                    model: task,
                    as: 'tasks',
                    attibutes: ['id', 'title', 'start_date', 'end_date', 'priority']
                }, {
                    model: user,
                    as: 'user',
                    attibutes: ['id', 'name', 'email', 'phone', 'phone']
                }],
                limit,
                offset
            });

            return res.status(200).json({
                message: 'Success',
                data: getPagingData(projectsList, page, limit)
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    //LIST USER PROJECTS
    static async listUserProjects(req, res) {
        try {
            const { user: { id } } = req;
            const { page, size } = req.query;

            const { limit, offset } = getPagination(page, size);
            const userProjects = await project.findAndCountAll({
                where: { user_id: id },
                include: [{
                    model: user,
                    as: 'user',
                    attributes: ['id', 'name', 'email', 'phone']
                }, {
                    model: task,
                    as: 'tasks',
                    attributes: ['id', 'title', 'start_date', 'end_date', 'priority']
                }]
            })

            return res.status(200).json({
                message: 'Success',
                data: getPagingData(userProjects, page, limit)
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }
}

export default ProjectController
