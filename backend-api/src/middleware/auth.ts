import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
import { AppError } from './error';
import { Document, Types } from 'mongoose';

interface UserDocument extends Document {
    _id: Types.ObjectId;
    email: string;
    name: string;
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401);
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        // Get user from database
        const user = await User.findById(decoded.id).select('-password') as UserDocument;
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Attach user to request object
        req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError('Invalid token', 401));
        } else {
            next(error);
        }
    }
};