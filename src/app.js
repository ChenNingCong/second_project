import express from 'express';
import morgan from 'morgan';

import productsRouter from './routers/ProductsRouter.js';
import authRouter from './routers/AuthRouter.js';
import session from 'express-session';
import { checkAuthenticated, injectFakeSession, isAuthenticated } from './middlewares/Auth.js';
import productDetailRouter from './routers/ProductDetailRouter.js';
import { fileURLToPath } from 'url';
import path from 'path';
import favoriteRouter from './routers/FavoriteRouter.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Request → Router → Middleware → Controller → Model → Database
// Database → Model → Controller → Response

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

const USE_AUTH = process.env.USE_AUTH != 'false'
if (USE_AUTH) {
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
} else {
  app.use(injectFakeSession)
}
app.use(express.static('public/unrestricted', {
  extensions: ['html', 'htm']
}))
app.get('/', (req, res) => {
  if (isAuthenticated(req)) {
    res.redirect('/products'); 
  } else {
    res.redirect('/login');
  }
});
app.use('/api', authRouter)
if (USE_AUTH) {
  app.use(checkAuthenticated)
}

app.use(express.static('public/restricted', {
  extensions: ['html', 'htm']
}))

app.use('/products/', productDetailRouter);
app.use('/api/products', productsRouter);
app.use('/api/favorites', favoriteRouter);

app.all('*', (_req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

export default app;
