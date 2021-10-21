const whitelist = process.env.CORS_ORIGINS.split('|');

export default {
  origin(origin: string | undefined, callback: (arg0: Error, arg1?: boolean) => void): void {
    if (!origin || whitelist.some((val) => origin.match(val))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  maxAge: 86400,
  headers: [
    'Accept',
    'Authorization',
    'Content-Type',
    'If-None-Match',
  ],
  exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  credentials: true,
};
