/**
 * When you dont need models maybe its simpler to use native mongo client?
 */
import {
  Collection, Db, MongoClient, MongoClientOptions, ReadPreference,
} from 'mongodb';
import fs from 'fs';

const { MONGODB_HOST } = process.env;
const MONGODB_PORT = Number(process.env.MONGODB_PORT) || 27017;
const MONGODB_USER = encodeURIComponent(process.env.MONGODB_USER || '');
const MONGODB_PASSWORD = encodeURIComponent(process.env.MONGODB_PASSWORD || '');
const MONGODB_NAME = process.env.MONGODB_NAME || 'database_name';
const MONGODB_SSL = process.env.MONGODB_SSL === 'true';
const MONGODB_REPLICA_SET = process.env.MONGODB_REPLICA_SET === 'true';

if (MONGODB_HOST === undefined || MONGODB_HOST.length === 0) {
  console.error('Environment variable MONGODB_HOST not set');
  process.exit(1);
}

const replicaOpts =
    MONGODB_REPLICA_SET ? { replicaSet: 'rs0', readPreference: ReadPreference.SECONDARY_PREFERRED } : {};
const sslOpts = MONGODB_SSL ? {
  ssl: true,
  sslValidate: true,
  sslCA: [fs.readFileSync('rds-combined-ca-bundle.pem')],
} : {};

const dbOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ignoreUndefined: true,
  ...sslOpts,
  ...replicaOpts,
};

const authPart = MONGODB_USER ? `${MONGODB_USER}:${MONGODB_PASSWORD}@` : '';
const mongoDbConnection = `mongodb://${authPart}${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_NAME}?ssl=${MONGODB_SSL}`;

const client: MongoClient = new MongoClient(mongoDbConnection, dbOptions);
let db: Db;

const MongoDB = {
  async connect(): Promise<void> {
    console.log(`Connecting to MongoDB ${MONGODB_HOST}:${MONGODB_PORT}`);
    try {
      await client.connect();
    } catch (error) {
      console.error('Failed to connect to MongoDB server');
      throw error;
    }
    db = client.db(MONGODB_NAME);

    console.log(`Connected to MongoDB database ${MONGODB_NAME}.`);
  },
  async close(): Promise<void> {
    return client.close();
  },
  collection<TSchema>(collectionName: string): Collection<TSchema> {
    return db.collection(collectionName);
  },
};

export default MongoDB;
