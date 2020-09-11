import { Request, Response, Router } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import UserRouter from './Users';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/users', UserRouter);

// Add defaults
router.get('/healthcheck', async (req: Request, res: Response) => res.status(StatusCodes.OK).send(ReasonPhrases.OK));

// Export the base-router
export default router;
