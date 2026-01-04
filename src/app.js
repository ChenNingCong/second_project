import express from 'express';
import morgan from 'morgan';

import productRouter from './routers/ProductsRouter.js';
import authRouter from './routers/AuthRouter.js';
import session from 'express-session';
import { CheckAuthenticated } from './middlewares/Auth.js';

// Request → Router → Middleware → Controller → Model → Database
// Database → Model → Controller → Response

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(session({
    secret: 'your_secret_key', // Keep this private
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
app.use(express.static('public/unrestricted', {
    extensions: ['html', 'htm']
}))
app.use('/api', authRouter)
app.use(CheckAuthenticated)
app.use('/api/products', productRouter);
app.use(express.static('public/restricted', {
    extensions: ['html', 'htm']
}))
app.all('*', (_req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

export default app;
