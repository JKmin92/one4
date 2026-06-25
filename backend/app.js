import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import adminProductRoutes from './routes/admin/shop/productRoutes.js';
import adminPromotionRoutes from './routes/admin/shop/promotionRoutes.js';
import adminShopBoardRoutes from './routes/admin/shop/boardRoutes.js';
import productRoutes from './routes/shop/productRoutes.js';
import shopBoardRoutes from './routes/shop/boardRoutes.js';
import orderRoutes from './routes/shop/orderRoutes.js';
import adminReviewCampaignRoutes from './routes/admin/review/reviewCampaignRoutes.js';
import reviewRoutes from './routes/review/reviewRoutes.js';
import utilRoutes from './routes/utilRoutes.js';
import adminOrderRoutes from './routes/admin/shop/orderRoutes.js';
import adminShopSettingRoutes from './routes/admin/shop/settingRoutes.js';
import adminMemberUserRoutes from './routes/admin/member/userRoutes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use('/api/admin/shop/product', adminProductRoutes);
app.use('/api/admin/shop/promotion', adminPromotionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shop/product', productRoutes);
app.use('/api/shop/board', shopBoardRoutes);
app.use('/api/shop/product/order', orderRoutes);
app.use('/api/admin/shop/setting', adminShopSettingRoutes);
app.use('/api/review/campaign', reviewRoutes);
app.use('/api/admin/shop/board', adminShopBoardRoutes);
app.use('/api/admin/review/campaign', adminReviewCampaignRoutes);
app.use('/api/admin/member/user', adminMemberUserRoutes);
app.use('/api/utils', utilRoutes);
app.use('/api/admin/shop/order', adminOrderRoutes);

app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err);

    res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다.',
        error: err.message
    });
});

export default app;