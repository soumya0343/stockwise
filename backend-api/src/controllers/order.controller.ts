import { Request, Response, NextFunction } from 'express';
import { Order } from '../models/order.model';
import { AppError } from '../middleware/error';

export class OrderController {
    static async createOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const { product, quantity, price } = req.body;
            
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const order = await Order.create({
                user: req.user.id,
                product,
                quantity,
                price
            });

            res.status(201).json({
                status: 'success',
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserOrders(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const orders = await Order.find({ user: req.user.id })
                .populate('product')
                .sort('-createdAt');

            res.json({
                status: 'success',
                data: { orders }
            });
        } catch (error) {
            next(error);
        }
    }

    static async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            const order = await Order.findByIdAndUpdate(
                orderId,
                { status },
                { new: true, runValidators: true }
            );

            if (!order) {
                throw new AppError('Order not found', 404);
            }

            res.json({
                status: 'success',
                data: { order }
            });
        } catch (error) {
            next(error);
        }
    }
}