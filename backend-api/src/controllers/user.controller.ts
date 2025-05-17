import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from '../middleware/error';
import { ErrorType } from '../types/errors';

export class UserController {
    private static createToken(userId: string): string {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );
    }

    private static formatUserResponse(user: any) {
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            watchlist: user.watchlist
        };
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name } = req.body;
            
            const userExists = await User.findOne({ email });
            if (userExists) {
                throw new AppError(
                    'Email already registered',
                    400,
                    ErrorType.VALIDATION_ERROR
                );
            }

            const user = await User.create({ email, password, name });
            const token = UserController.createToken(user._id);

            res.status(201).json({
                status: 'success',
                data: {
                    token,
                    user: UserController.formatUserResponse(user)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            
            const user = await User.findOne({ email }).select('+password');
            if (!user || !(await user.comparePassword(password))) {
                throw new AppError(
                    'Invalid credentials',
                    401,
                    ErrorType.AUTHENTICATION_ERROR
                );
            }

            const token = UserController.createToken(user._id);

            // Remove password from response
            user.password = undefined;

            res.json({
                status: 'success',
                data: {
                    token,
                    user: UserController.formatUserResponse(user)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError(
                    'User not authenticated',
                    401,
                    ErrorType.AUTHENTICATION_ERROR
                );
            }

            // Prevent password update through this route
            const { name, email } = req.body;

            // Check if email is already taken
            if (email) {
                const existingUser = await User.findOne({ email });
                if (existingUser && existingUser._id.toString() !== req.user.id) {
                    throw new AppError(
                        'Email already in use',
                        400,
                        ErrorType.VALIDATION_ERROR
                    );
                }
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { name, email },
                { new: true, runValidators: true }
            );

            if (!user) {
                throw new AppError(
                    'User not found',
                    404,
                    ErrorType.NOT_FOUND
                );
            }

            res.json({
                status: 'success',
                data: {
                    user: UserController.formatUserResponse(user)
                }
            });
        } catch (error) {
            next(error);
        }
    }
}