import { Request, Response, Router } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const router = Router();
async function healthCheckRouteHandler(req: Request, res: Response): Promise<void> {
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
}
router.get('/healthcheck', healthCheckRouteHandler);

export default router;
