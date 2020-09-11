import {
  Collection, Db, MongoClient, MongoClientOptions,
} from 'mongodb';

const mongoDbConnection = String(process.env.MONGODB_CONNECTION || '');

if (mongoDbConnection === undefined || mongoDbConnection.length === 0) {
  console.error('Environment variable MONGODB_CONNECTION not set');
  process.exit(1);
}

const dbOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ignoreUndefined: true,
};

const useSsl = mongoDbConnection.indexOf('ssl=true') > -1;
if (useSsl) {
  console.log('Using SSL for MongoDB');
  dbOptions.sslCA = [require('fs').readFileSync('rds-combined-ca-bundle.pem')];
  dbOptions.sslValidate = true;
}

function getDbName(uri: string) {
  const temp1 = uri.lastIndexOf('/') + 1;
  const temp2 = uri.lastIndexOf('?');
  if (temp2 > -1) {
    return uri.slice(temp1, temp2);
  }
  return uri.slice(temp1);
}

const client: MongoClient = new MongoClient(mongoDbConnection, dbOptions);
let db: Db|undefined;

export default {
  async connect(): Promise<void> {
    console.log(`Connecting to MongoDB on ${mongoDbConnection}`);
    await client.connect();
    const dbName = getDbName(mongoDbConnection);
    db = client.db(dbName);
    console.log(`Connected to MongoDB database ${dbName}.`);
  },
  close(): Promise<void> {
    return client.close();
  },
  collection(collectionName: string): Collection {
    return db.collection(collectionName);
  },
};
