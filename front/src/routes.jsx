import { createBrowserRouter } from 'react-router-dom';

import GeneralLayout from './views/common/Layout';

import Login from './views/user/Login';
import Join from './views/user/Join';

import MypageLayout from './views/user/mypage/Layout';
import MypageMain from './views/user/mypage/Main';
import MypageInfo from './views/user/mypage/Info';
import MypageReview from './views/user/mypage/review/List';
import MypageReviewDetail from './views/user/mypage/review/Detail';
import MypageOrderList from './views/user/mypage/shop/List';
import MypageOrderDetail from './views/user/mypage/shop/Detail';

import ShopLayout from './views/shop/common/Layout';
import ShopMain from './views/shop/Main';
import ShopProductList from './views/shop/product/ProductList';
import ShopProductDetail from './views/shop/product/Detail';
import ShopCart from './views/shop/product/Cart';
import ShopOrder from './views/shop/product/Order';
import ShopOrderComplete from './views/shop/product/OrderComplete';
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
import AdminReviewCampaignDetail from './views/admin/review/campaign/Detail';

import AdminOrderTotalList from './views/admin/shop/order/TotalList';
import AdminOrderUnpaidList from './views/admin/shop/order/UnpaidList';
import AdminPaidList from './views/admin/shop/order/PaidList';
import AdminDeliveryReadyList from './views/admin/shop/order/DeliveryReadyList';
import AdminShippingList from './views/admin/shop/order/ShippingList';
import AdminDeliveredList from './views/admin/shop/order/DeliveredList';
import AdminCompletedList from './views/admin/shop/order/CompletedList';
import AdminOrderDetail from './views/admin/shop/order/OrderDetail';
import AdminOrderClaimList from './views/admin/shop/claim/List';

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
            { path: '/order/complete', element: <ShopOrderComplete /> },
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
            { path: 'info', element: <MypageInfo /> },
            { path: 'review', element: <MypageReview /> },
            { path: 'review/:campaign_application_code', element: <MypageReviewDetail /> },
            { path: 'order', element: <MypageOrderList /> },
            { path: 'order/:order_code', element: <MypageOrderDetail /> }
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
            { path: 'shop/order/total', element: <AdminOrderTotalList /> },
            { path: 'shop/order/unpaid', element: <AdminOrderUnpaidList /> },
            { path: 'shop/order/paid', element: <AdminPaidList /> },
            { path: 'shop/order/delivery_ready_list', element: <AdminDeliveryReadyList /> },
            { path: 'shop/order/delivery_list', element: <AdminShippingList /> },
            { path: 'shop/order/delivered_list', element: <AdminDeliveredList /> },
            { path: 'shop/order/complete_list', element: <AdminCompletedList /> },
            { path: 'shop/order/:order_code', element: <AdminOrderDetail /> },
            { path: 'shop/claim/:id', element: <AdminOrderClaimList /> },
            { path: 'review/campaign/list', element: <AdminReviewCampaignList /> },
            { path: 'review/campaign/register', element: <AdminReviewCampaignRegister /> },
            { path: 'review/campaign/update/:id', element: <AdminReviewCampaignRegister /> },
            { path: 'review/campaign/detail/:id', element: <AdminReviewCampaignDetail /> }

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