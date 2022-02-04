import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express, { Express } from 'express';
import 'express-async-errors';
import corsOptions from '@src/config/cors';
import { errorHandlers } from '@src/shared/errorHandler';
import BaseRouter from '@src/routes/BaseRouter';
import { connect as dbConnect } from '@src/clients/mongooseClient';
import { StatusCodes } from 'http-status-codes';

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny', {
    skip: (req, res) => res.statusCode < 400,
  }));
}
// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}
app.use(cors(corsOptions));

app.use('/', BaseRouter);

app.use(...errorHandlers);

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({});
});

/** **********************************************************************************************
 *             Async start of application making sure that components are loaded
 ********************************************************************************************** */
const init = async (): Promise<Express> => {
  await dbConnect();
  return app;
};

// Export express instance
export default init;
