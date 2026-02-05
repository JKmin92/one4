import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import adminProductRoutes from './routes/admin/productRoutes.js';
import productRoutes from './routes/shop/productRoutes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/user', userRoutes);
app.use('/api/admin/product', adminProductRoutes);
app.use('/api/shop/product', productRoutes);

export default app;