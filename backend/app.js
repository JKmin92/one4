import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import adminProductRoutes from './routes/admin/shop/productRoutes.js';
import adminPromotionRoutes from './routes/admin/shop/promotionRoutes.js';
import adminShopBoardRoutes from './routes/admin/shop/boardRoutes.js';
import productRoutes from './routes/shop/productRoutes.js';
import shopBoardRoutes from './routes/shop/boardRoutes.js';
import adminReviewCampaignRoutes from './routes/admin/review/reviewCampaignRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/admin/shop/product', adminProductRoutes);
app.use('/api/admin/shop/promotion', adminPromotionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shop/product', productRoutes);
app.use('/api/shop/board', shopBoardRoutes);
app.use('/api/admin/shop/board', adminShopBoardRoutes);
app.use('/api/admin/review/campaign', adminReviewCampaignRoutes);

export default app;