jest.mock('@src/logger/Logger');

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error';

process.env.CORS_ORIGINS = 'http://localhost:9000';
