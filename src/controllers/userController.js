import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../../models/index.js';
import { validateEmail } from '../helpers/Validation.js';
import { comparePassword, hashPassword } from '../helpers/Password.js';

// CONFIGURE DOTENV
dotenv.config();

// LOAD ENVIRONMENT VARIABLES
const { JWT_SECRET } = process.env;

// LOAD MODELS
const { user } = db;

// USER CLASS

class UserController {

    // CREATE USER
    static async createUser(req, res) {
        try {
            const { name, email, password, phone = '', address = '' } = req.body;

            if (!validateEmail(email)) {
                return res.status(400).json({
                    message: 'Invalid email'
                })
            }

            const userExists = await user.findOne({
                where: { email }
            });

            if (userExists) {
                return res.status(409).json({
                    message: 'A user with this email address already exists'
                })
            }

            if (phone && phone === userExists?.phone) {
                return res.status(409).json({
                    message: 'Phone number already exists'
                })
            }

            const newUser = await user.create({
                name,
                email,
                password: await hashPassword(password),
                phone,
                address,
            });

            const token = jwt.sign({ id: newUser?.id, email: newUser?.email }, JWT_SECRET, {
                expiresIn: '1d'
            });

            return res.status(201).json({
                message: 'Success',
                data: {
                    user: { ...newUser?.dataValues, password: null },
                    token
                }
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // LOGIN USER
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            const userExists = await user.scope('withPassword').findOne({
                where: { email }
            });

            if (!userExists) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }

            const isPasswordValid = await comparePassword(password, userExists?.password);

            if (!isPasswordValid) {
                return res.status(400).json({
                    message: 'Email or password not correct'
                })
            }

            const token = jwt.sign({ id: userExists?.id, email: userExists?.email }, JWT_SECRET, {
                expiresIn: '1d'
            });

            return res.status(200).json({
                message: 'Success',
                data: {
                    user: { ...userExists?.dataValues, password: null },
                    token
                }
            })

        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // UPDATE USER
    static async updateUser(req, res) {
        try {

            const { user: { id } } = req;

            const { name, email, phone, address } = req.body;

            const userExists = await user.findOne({
                where: { id }
            });

            if (!userExists) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }

            const updatedUser = await user.update({
                name: name || userExists?.name,
                email: email || userExists?.email,
                phone: phone || userExists?.phone,
                address: address || userExists?.address,
            }, {
                where: { id },
                returning: true,
            });

            return res.status(200).json({
                message: 'Success',
                data: {
                    user: { ...updatedUser[1][0]?.dataValues, password: null }
                }
            })

        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // UPDATE USER PASSWORD
    static async changePassword(req, res) {
        try {
            const { user: { id } } = req;
            const { existingPassword, newPassword } = req.body

            const userExists = await user.scope('withPassword').findOne({
                where: { id }
            })

            if (!userExists) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }

            const isValidPassword = await comparePassword(existingPassword, userExists?.password)

            if (!isValidPassword) {
                return res.status(400).json({
                    message: 'Incorrect password'
                })
            }

            const updateUser = await user.update({
                password: await hashPassword(newPassword)
            }, {
                where: { id }
            })

            return res.status(200).json({
                message: 'Success'
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }

    // GET USER DETAILS
    static async getUserDetails(req, res) {
        try {
            const { user: { id } } = req;

            const userExists = await user.findOne({
                where: { id }
            });

            return res.status(200).json({
                message: 'Success',
                data: userExists
            })
        } catch (error) {
            return res.status(500).json({
                message: error?.message
            })
        }
    }
}

export default UserController;
