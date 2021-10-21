import {
  ErrorRequestHandler, NextFunction, Request, Response,
} from 'express';
import { ExpressJoiError } from 'express-joi-validation';
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import logger from '@src/logger/Logger';

export function validationErrorHandler(err: ExpressJoiError, req: Request, res: Response, next: NextFunction): void {
  const { error } = err;
  if (Joi.isError(error)) {
    const errors = error.details.map((item) => ({
      field: item.context.key,
      error: item.message,
    }));
    logger.debug(err);
    res.status(StatusCodes.BAD_REQUEST).json(errors);
  } else {
    next(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function unknownErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  logger.error(err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
}

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTraps: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.map(async (type: string): Promise<void> => {
  process.on(type, async (error) => {
    try {
      logger.info(`process.on ${type}`);
      logger.error(error);
      process.exit(0);
    } catch (e) {
      logger.error(e);
      process.exit(1);
    }
  });
});

signalTraps.map(async (type: NodeJS.Signals): Promise<void> => {
  process.once(type, async () => {
    try {
    } catch (e) {
      logger.error(e);
    } finally {
      process.kill(process.pid, type);
    }
  });
});

export const errorHandlers: ErrorRequestHandler[] = [validationErrorHandler, unknownErrorHandler];
