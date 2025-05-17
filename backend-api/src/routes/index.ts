import { Router } from 'express';

const apiRouter = Router();

// Define routes here
apiRouter.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

export { apiRouter };