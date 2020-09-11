import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';

import express, {
  Request, Response, Express,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import 'express-async-errors';

import logger from '@shared/Logger';
import Mongo from '@shared/Mongo';
// import Redis from '@shared/Redis';
import BaseRouter from './routes';
import corsOptions from '@shared/cors';

// Init express
const app = express();

/** **********************************************************************************
 *                              Set basic express settings
 ********************************************************************************** */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// <TODO> Show routes called in console during development
// if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev'));
// }

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}
app.use(cors(corsOptions));

// Add APIs
app.use('/api', BaseRouter);

// Print API errors
app.use((err: Error, req: Request, res: Response) => {
  logger.error(err.message, err);
  return res.status(StatusCodes.BAD_REQUEST)
      // <TODO> only for api
      .set('Content-Type', 'application/problem+json')
      .json({
        error: err.message,
      });
});

/** **********************************************************************************
 *                              Serve front-end content
 ********************************************************************************** */

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
// <TODO> Uncomment this in case of static file access requirement
// app.get('*', (req: Request, res: Response) => {
//   res.sendFile('index.html', { root: viewsDir });
// });

/** **********************************************************************************************
 *             Async start of application making sure that components are loaded
 ********************************************************************************************** */
const init = async (): Promise<Express> => {
  await Mongo.connect();
  // await Redis.init();
  return app;
};
// Export express instance
export default init;
