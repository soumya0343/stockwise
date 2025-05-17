import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ErrorType, ErrorResponse } from '../types/errors';

export class AppError extends Error {
    statusCode: number;
    status: string;
    type: ErrorType;
    errors?: string[];

    constructor(message: string, statusCode: number, type: ErrorType, errors?: string[]) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.type = type;
        this.errors = errors;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.warn({
            type: err.type,
            message: err.message,
            statusCode: err.statusCode,
            path: req.path,
            errors: err.errors
        });

        const errorResponse: ErrorResponse = {
            type: err.type,
            message: err.message
        };

        if (err.errors) {
            errorResponse.errors = err.errors;
        }

        return res.status(err.statusCode).json(errorResponse);
    }

    logger.error({
        type: ErrorType.INTERNAL_ERROR,
        message: err.message,
        stack: err.stack,
        path: req.path
    });

    const errorResponse: ErrorResponse = {
        type: ErrorType.INTERNAL_ERROR,
        message: 'Internal server error'
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    return res.status(500).json(errorResponse);
};