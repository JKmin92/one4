import { createBrowserRouter } from 'react-router-dom';

import GeneralLayout from './views/common/Layout';

import Login from './views/user/Login';
import Join from './views/user/Join';

import MypageLayout from './views/user/mypage/Layout';
import MypageMain from './views/user/mypage/Main';

import ShopLayout from './views/shop/common/Layout';
import ShopMain from './views/shop/Main';
import ShopProductList from './views/shop/product/ProductList';
import ShopProductDetail from './views/shop/product/Detail';
import ShopCart from './views/shop/product/Cart';
import ShopOrder from './views/shop/product/Order';
import ShopBoardRegister from './views/shop/board/Register';

import ReviewLayout from './views/review/common/Layout';
import ReviewMain from './views/review/Main';
import ReviewList from './views/review/List';
import ReviewDetail from './views/review/Detail';
import ReviewApplication from './views/review/Application';

import AdminLayout from './views/admin/common/Layout';
import AdminProductList from './views/admin/shop/product/List';
import AdminProductRegister from './views/admin/shop/product/Register';
import AdminProductCategory from './views/admin/shop/product/Category';
import AdminPromotionList from './views/admin/shop/promotion/List';
import AdminPromotionRegister from './views/admin/shop/promotion/Register';
import AdminBoardList from './views/admin/shop/board/List';
import AdminBoardDetail from './views/admin/shop/board/Detail';
import AdminReviewCampaignList from './views/admin/review/campaign/List';
import AdminReviewCampaignRegister from './views/admin/review/campaign/Register';

const router = createBrowserRouter([
    {
        path: '/',
        element: <GeneralLayout />,
        children: [
            { path: '', element: <ShopMain /> },
            { path: '/categorys/:id', element: <ShopProductList /> },
            { path: '/products/:id', element: <ShopProductDetail /> },
            { path: '/cart', element: <ShopCart /> },
            { path: '/order', element: <ShopOrder /> },
            { path: '/board/register/:type/:id', element: <ShopBoardRegister /> },
            { path: '/board/update/:type/:id', element: <ShopBoardRegister /> }
        ]
    }, {
        path: '/',
        element: <GeneralLayout />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/join', element: <Join /> }
        ]
    }, {
        path: '/mypage',
        element: <MypageLayout />,
        children: [
            { path: '', element: <MypageMain /> },
        ]
    }, {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { path: 'shop/product/list', element: <AdminProductList /> },
            { path: 'shop/product/register', element: <AdminProductRegister /> },
            { path: 'shop/product/update/:id', element: <AdminProductRegister /> },
            { path: 'shop/product/category', element: <AdminProductCategory /> },
            { path: 'shop/promotion/list', element: <AdminPromotionList /> },
            { path: 'shop/promotion/register', element: <AdminPromotionRegister /> },
            { path: 'shop/promotion/update/:id', element: <AdminPromotionRegister /> },
            { path: 'shop/board/list/:type', element: <AdminBoardList /> },
            { path: 'shop/board/:type/:id', element: <AdminBoardDetail /> },
            { path: 'review/campaign/list', element: <AdminReviewCampaignList /> },
            { path: 'review/campaign/register', element: <AdminReviewCampaignRegister /> },
            { path: 'review/campaign/update/:id', element: <AdminReviewCampaignRegister /> },
        ]
    }, {
        path: '/review',
        element: <GeneralLayout />,
        children: [
            { path: '', element: <ReviewMain /> },
            { path: 'categorys/:id', element: <ReviewList /> },
            { path: 'detail/:campaign_code', element: <ReviewDetail /> },
            { path: 'application/:campaign_code', element: <ReviewApplication /> }
        ]
    }
])

export default router;