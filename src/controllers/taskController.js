import dotenv from 'dotenv';
import moment from 'moment'
import db, { sequelize } from '../../models/index.js'
import uploadDocument, { getFileExtension } from '../helpers/uploadDocument.js';
import { getPagination, getPagingData } from '../helpers/Pagination.js';

// CONFIGURE DOTENV
dotenv.config();

// LOAD DATABASE MODELS
const { task, user, task_file, project_task, task_assignee, project } = db;

class TaskController {
    // CREATE TASK
    static async createTask(req, res) {

        // INITIALIZE TRANSACTION
        const t = await sequelize.transaction();
        try {
            const { title, description, start_date, end_date, priority, task_assignees, task_projects, draft, status } = req.body;
            const { user: { id } } = req;


            // INITIALIZE REUSABLE VARIABLES
            let uploadedFiles = [], projectTasks = [], taskAssignees = [];

            // VALIDATE INPUTS
            if (!title || !start_date || description?.length > 1000) {
                return res.status(400).json({ error: 'Bad request' });
            }

            // CHECK IF TASK EXISTS
            const taskExists = await task.findOne({ where: { title, user_id: id } });

            if (taskExists) {
                return res.status(409).json({ error: 'Task already exists' });
            }

            // CHECK IF THERE ARE SUBMITTED FILES AND UPLOAD THEM
            if (req?.files?.length > 0) {
                uploadedFiles = await Promise.all(req.files.map(async (file) => {
                    const uploadedFile = await uploadDocument(file, {
                        folder: 'tasks',
                        fileName: Date.now(),
                        extension: getFileExtension(file.originalname),
                    });
                    return uploadedFile;
                }))
            }

            if (uploadedFiles?.status === false) {
                return res.status(502).json({
                    message: 'Could not upload images'
                })
            }

            // CREATE TASK
            const createTask = await task.create({
                title,
                description,
                start_date: moment(start_date).format('YYYY-MM-DDTHH:MM:SSZ'),
                end_date: end_date ? moment(end_date).format('YYYY-MM-DDTHH:MM:SSZ') : moment().add(1, 'months').format('YYYY-MM-DDTHH:MM:SSZ'),
                priority,
                user_id: id,
                status,
                draft
            }, { transaction: t });

            // CREATE TASK FILES
            const taskFiles = await Promise.all(uploadedFiles.map(async (file) => {
                const createFile = await task_file.create({
                    url: file?.url,
                    task_id: createTask.id,
                    name: file?.originalFileName,
                    user_id: id
                }, { transaction: t })
                return createFile;
            }))

            // CHECK IF THERE ARE ASSIGNED PROJECTS AND CREATE THEM
            if (task_projects?.length > 0) {
                projectTasks = await Promise.all(task_projects?.map(async (project) => {
                   const projectTask = await project_task.create({
                    task_id: createTask.id,
                    project_id: project,
                    user_id: id
                   }, { transaction: t })
                   return projectTask
                }))
            }

            // CHECK IF THERE ARE TASK ASSIGNEES AND CREATE THEM
            if (task_assignees?.length > 0) {
                taskAssignees = await Promise.all(task_assignees?.map(async (assignee) => {
                    const taskAssignee = await task_assignee.create({
                        user_id: assignee,
                        task_id: createTask.id,
                    }, {transaction: t})
                    return taskAssignee
                }))
            }

            await t.commit();

            return res.status(201).json({
                message: 'Success',
                data: {
                    task: createTask,
                    files: taskFiles,
                    assignedProjects: projectTasks,
                    assignees: taskAssignees
                },
            })
        } catch (error) {
            await t.rollback();
            return res.status(500).json({ message: error.message });
        }
    }
    
    // LIST ALL TASKS
    static async listAllTasks(req, res) {
        try {
            const { page, size, assignee_id } = req.query;

            const { limit, offset } = getPagination(page, size);

            const tasksList = await task.findAndCountAll({
                include: [
                    {
                        model: user,
                        as: 'user',
                        attributes: ['id', 'name', 'email', 'phone']
                    },
                    {
                        model: user,
                        as: 'assignees',
                        attributes: ['id', 'name', 'phone']
                    }
                ],
                limit,
                offset
            });

            if (assignee_id) {
                tasksList?.rows?.filter(task => task?.assignees?.some(assignee => assignee?.id === assignee_id))
            }

            return res.status(200).json({
                message: 'Success',
                data: getPagingData(tasksList, page, limit),
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    //LIST USER TASKS
    static async listUserTasks(req, res) {
        try {
            const { user: { id } } = req;

            const { page, size } = req.query;

            const { limit, offset } = getPagination(page, size);

            const userTasks = await task.findAndCountAll({
                where: { user_id: id },
                include: [
                    {
                        model: user,
                        as: 'user',
                        attributes: ['id', 'name', 'email', 'phone', 'address']
                    },
                    {
                        model: user,
                        as: 'assignees',
                        attributes: ['id', 'name', 'phone']
                    }
                ],
                limit,
                offset
            })

            return res.status(200).json({
                message: 'Success',
                data: getPagingData(userTasks, page, limit)
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // GET TASK DETAILS
    static async getTaskDetails(req, res) {
        try {
            const { id } = req.params;

            const taskDetails = await task.findOne({
                where: { id },
                include: [
                    {
                        model: user,
                        as: 'user',
                        attributes: ['id', 'name', 'email', 'phone', 'address']
                    },
                    {
                        model: task_file,
                        as: 'files',
                        attributes: ['id', 'url', 'name']
                    },
                    {
                        model: project,
                        as: 'projects',
                        attributes: ['id', 'title', 'description'],
                    },
                    {
                        model: user,
                        as: 'assignees',
                        attributes: ['id', 'name', 'phone']
                    }
                ]
            })

            return res.status(200).json({
                message: 'Success',
                data: taskDetails
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // UPDATE TASK
    static async updateTask(req, res) {
        try {
            const { title, status, description, start_date, end_date, priority } = req.body;

            // GET TASK ID
            const { id } = req.params;

            // CHECK IF TASK EXISTS
            const taskExists = await task.findOne({ where: { id } });

            if (!taskExists) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // UPDATE TASK
            const updateTask = await taskExists.update({
                title: title || taskExists.title,
                status: status || taskExists.status,
                description: description || taskExists.description,
                start_date: start_date || taskExists?.start_date,
                end_date: end_date || taskExists?.end_date,
                priority: priority || taskExists?.priority
            }, { where: { id } });

            // RETURN RESPONSE
            return res.status(200).json({
                message: 'Success',
                data: updateTask
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // DELETE TASK
    static async deleteTask(req, res) {
        try {
            const { id } = req.params;

            // CHECK IF TASK EXISTS
            const taskExists = await task.findOne({ where: { id } });

            if (!taskExists) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // DELETE TASK
            await task.destroy({ where: { id } });

            return res.status(204).json({
                message: 'Task deleted successfully'
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }
}

export default TaskController;
