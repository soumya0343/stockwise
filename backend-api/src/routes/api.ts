import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { UserController } from '../controllers/user.controller';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';
import { stockValidation } from '../middleware/validation';
import { userValidation } from '../middleware/validation';
import { orderValidation } from '../middleware/validation';

const router = Router();

// Auth routes
router.post('/auth/register', userValidation.register, UserController.register);
router.post('/auth/login', userValidation.login, UserController.login);

// Stock routes (protected)
router.use('/stocks', authenticate);
router.get('/stocks', stockValidation.getAll, StockController.getAllStocks);
router.get('/stocks/:id', stockValidation.getById, StockController.getStockById);
router.post('/stocks/search', stockValidation.search, StockController.searchStocks);
router.post('/stocks/watchlist', stockValidation.addToWatchlist, StockController.addToWatchlist);
router.delete('/stocks/watchlist/:id', stockValidation.removeFromWatchlist, StockController.removeFromWatchlist);

// User routes (protected)
router.use('/user', authenticate);
router.get('/user/profile', UserController.getProfile);
router.put('/user/profile', userValidation.updateProfile, UserController.updateProfile);
router.get('/user/watchlist', UserController.getWatchlist);

// Order routes (protected)
router.use('/orders', authenticate);
router.post('/orders', orderValidation.create, OrderController.createOrder);
router.get('/orders', orderValidation.getAll, OrderController.getUserOrders);
router.patch('/orders/:orderId/status', orderValidation.updateStatus, OrderController.updateOrderStatus);

export { router as apiRouter };