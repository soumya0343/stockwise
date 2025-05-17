import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { AppError } from '../middleware/error';


export class StockController {
    static async getAllStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const stocks = await Product.find().sort('symbol');
            res.json({
                status: 'success',
                data: { stocks }
            });
        } catch (error) {
            next(error);
        }
    }

    static async getStockById(req: Request, res: Response, next: NextFunction) {
        try {
            const stock = await Product.findById(req.params.id);
            if (!stock) {
                throw new AppError('Stock not found', 404);
            }
            res.json({
                status: 'success',
                data: { stock }
            });
        } catch (error) {
            next(error);
        }
    }

    static async searchStocks(req: Request, res: Response, next: NextFunction) {
        try {
            const { query } = req.body;
            const stocks = await Product.find({
                $or: [
                    { symbol: { $regex: query, $options: 'i' } },
                    { name: { $regex: query, $options: 'i' } }
                ]
            });
            res.json({
                status: 'success',
                data: { stocks }
            });
        } catch (error) {
            next(error);
        }
    }

    static async addToWatchlist(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const { stockId } = req.body;
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $addToSet: { watchlist: stockId } },
                { new: true }
            ).populate('watchlist');

            if (!user) {
                throw new AppError('User not found', 404);
            }

            res.json({
                status: 'success',
                data: { watchlist: user.watchlist }
            });
        } catch (error) {
            next(error);
        }
    }

    static async removeFromWatchlist(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                throw new AppError('User not authenticated', 401);
            }

            const stockId = req.params.id;
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $pull: { watchlist: stockId } },
                { new: true }
            ).populate('watchlist');

            if (!user) {
                throw new AppError('User not found', 404);
            }

            res.json({
                status: 'success',
                data: { watchlist: user.watchlist }
            });
        } catch (error) {
            next(error);
        }
    }
}