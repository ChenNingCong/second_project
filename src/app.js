import express from 'express';
import morgan from 'morgan';

import productRouter from './routers/ProductsPageRouter.js';

// Request → Router → Middleware → Controller → Model → Database
// Database → Model → Controller → Response

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/products', productRouter);

app.all('*', (_req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

export default app;
