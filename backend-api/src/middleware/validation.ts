import { body, param, query } from 'express-validator';
import { validateRequest } from './validateRequest';
import { AppError } from './error';
import { ErrorType } from '../types/errors';

const passwordValidator = body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character');

export const userValidation = {
    register: [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address')
            .normalizeEmail(),
        passwordValidator,
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),
        validateRequest
    ],

// export const userValidation = {
//     register: [
//         body('email')
//             .isEmail()
//             .withMessage('Please enter a valid email address'),
//         body('password')
//             .isLength({ min: 6 })
//             .withMessage('Password must be at least 6 characters long'),
//         body('name')
//             .trim()
//             .notEmpty()
//             .withMessage('Name is required'),
//         validateRequest
//     ],
    
    login: [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
        validateRequest
    ],

    updateProfile: [
        body('email')
            .optional()
            .isEmail()
            .withMessage('Please enter a valid email address'),
        body('name')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Name cannot be empty'),
        validateRequest
    ]
};

export const stockValidation = {
    getAll: [
        query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit'),
        validateRequest
    ],
    getById: [
        param('id').isMongoId().withMessage('Invalid stock ID'),
        validateRequest
    ],
    search: [
    body('query')
        .trim()
        .notEmpty()
        .withMessage('Search query is required')
        .isLength({ min: 1, max: 50 })
        .withMessage('Search query must be between 1 and 50 characters')
        .matches(/^[a-zA-Z0-9\s-]+$/)
        .withMessage('Search query can only contain letters, numbers, spaces, and hyphens'),
    body('minPrice')
        .optional()
        .isFloat({ min: 0, max: 1000000 })
        .withMessage('Minimum price must be between 0 and 1,000,000')
        .customSanitizer(value => value ? Number(value) : value),
    body('maxPrice')
        .optional()
        .isFloat({ min: 0, max: 1000000 })
        .withMessage('Maximum price must be between 0 and 1,000,000')
        .customSanitizer(value => value ? Number(value) : value)
        .custom((value, { req }) => {
            if (req.body.minPrice && value && value <= req.body.minPrice) {
                throw new Error('Maximum price must be greater than minimum price');
            }
            return true;
        }),
    body(['sortBy', 'sortOrder'])
        .optional()
        .isIn(['price', 'volume', 'marketCap', 'symbol', 'asc', 'desc'])
        .withMessage('Invalid sort parameter'),
    validateRequest
],
    addToWatchlist: [
        body('stockId').isMongoId().withMessage('Invalid stock ID'),
        validateRequest
    ],
    removeFromWatchlist: [
        param('id').isMongoId().withMessage('Invalid stock ID'),
        validateRequest
    ]
};

export const orderValidation = {
    create: [
        body('product').isMongoId().withMessage('Invalid product ID'),
        body('quantity')
            .isInt({ min: 1, max: 1000 })
            .withMessage('Quantity must be between 1 and 1000'),
        body('price')
            .isFloat({ min: 0, max: 1000000 })
            .withMessage('Price must be between 0 and 1,000,000'),
        validateRequest
    ],
    getAll: [
        query('page').optional().isInt({ min: 1 }).withMessage('Invalid page number'),
        query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Invalid limit'),
        validateRequest
    ],
    updateStatus: [
        param('orderId').isMongoId().withMessage('Invalid order ID'),
        body('status')
            .isIn(['pending', 'completed', 'cancelled'])
            .withMessage('Invalid status'),
        validateRequest
    ]
};
