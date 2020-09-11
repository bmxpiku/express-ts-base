const whitelist = ['http://example1.com', 'http://example2.com']
export default {
    origin: function (origin: string, callback: (arg0: Error, arg1?: boolean) => void) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    maxAge: 86400,
    headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
    exposedHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    credentials: true,
};
