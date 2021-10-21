import dotenv from 'dotenv';

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  require('module-alias/register');
}
