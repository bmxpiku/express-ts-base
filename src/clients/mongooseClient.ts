import mongoose, { ConnectOptions, Mongoose } from 'mongoose';
import fs from 'fs';
import { URL } from 'url';
import logger from '@src/logger/Logger';

const db = mongoose.connection;

const opts : ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  ignoreUndefined: true,
};

const {
  MONGODB_USER, MONGODB_PASS, MONGODB_HOST, MONGODB_PORT, MONGODB_DB,
  MONGODB_SSL, MONGODB_REPLSET,
} = process.env;

/**
 * Format;
 * mongodb://[$MONGODB_USER:MONGODB_PASS@]$MONGODB_HOST/$MONGODB_DB?options
 */
const createConnString = () : string => {
  let user = '';
  if (MONGODB_USER && MONGODB_PASS) {
    user = `${MONGODB_USER}:${MONGODB_PASS}@`;
  }
  const url = new URL(
    `mongodb://${user}${MONGODB_HOST || 'localhost'}:${MONGODB_PORT || '27017'}/${MONGODB_DB || 'auth_service'}`,
  );
  if (MONGODB_SSL && MONGODB_SSL.length > 0) {
    url.searchParams.set('ssl', 'true');
  }
  return url.toString();
};

// Connect.
const url = createConnString();
if (MONGODB_REPLSET && MONGODB_REPLSET.length > 0) {
  opts.replicaSet = MONGODB_REPLSET;
  opts.readPreference = 'secondaryPreferred';
}
if (MONGODB_SSL && MONGODB_SSL.length > 0) {
  const ca = [fs.readFileSync('rds-combined-ca-bundle.pem')];
  opts.sslValidate = true;
  opts.sslCA = ca;
}
db.on('error', console.error.bind(console, 'Connection error :'));

export const connect = async () : Promise<Mongoose> => {
  logger.info(`Connecting to MongoDB on ${url}`);
  return mongoose.connect(url, opts)
    .then((connection) => {
      logger.info('Connected');
      return connection;
    })
    .catch((error) => {
      logger.error('Connection failed', error.message);
      process.exit(1);
    });
};

export default mongoose;
