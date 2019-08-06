import * as cors from 'cors';

export function configCors(app) {
    const whitelist = ['http://localhost:3000'];
    const corsOptions = {
        origin (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    };
    app.options('*', cors()); // CORS pre-flight
    app.use(cors(corsOptions));
}
