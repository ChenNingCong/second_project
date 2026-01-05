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
import { fail } from './utils/error.js';

function createApp() {
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
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    next();
  });
  const USE_AUTH = process.env.USE_AUTH != 'false'
  console.log(USE_AUTH)
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

  app.all('*', (req, res) => {
    res.status(404).render('Error', {
      errorCode: 404,
      message: `The path "${req.originalUrl}" does not exist on this server.`,
      redirectTo: "/"
    });
  });

  app.use((err, req, res, next) => {
    if (err.isOperational) {
      if (err.code == 404) {
        res.status(404).render('Error', {
          errorCode: 404,
          message: err.message,
          redirectTo: "/"
        });
      } else if (err.code == 401) {
        res.status(401).render('Error', {
          errorCode: 401,
          message: "Unauthorized Access",
          redirectTo: "/login"
        });
      }
      else {
        fail(res, err.code, err.message)
      }
    } else {
      next(err)
    }
  });
  return app
}

export default createApp;
