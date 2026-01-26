import { createBrowserRouter } from 'react-router-dom';

import GeneralLayout from './views/common/Layout';

import Login from './views/user/Login';
import Join from './views/user/Join';

import ShopLayout from './views/shop/common/Layout';
import ShopMain from './views/shop/Main';

import ShopProductList from './views/shop/product/ProductList';
import ShopProductDetail from './views/shop/product/Detail';
import ShopCart from './views/shop/product/Cart';
import ShopOrder from './views/shop/product/Order';

const router = createBrowserRouter([
    {
        path:'/',
        element : <ShopLayout />,
        children : [
            {path:'', element:<ShopMain />},
            {path:'/categorys/:id', element:<ShopProductList />},
            {path:'/products/:id', element:<ShopProductDetail />},
            {path:'/cart', element:<ShopCart />},
            {path:'/order', element:<ShopOrder />}
        ]
    }, {
        path : '/',
        element : <GeneralLayout />,
        children : [
            {path:'/login', element: <Login />},
            {path:'/join', element: <Join />}
        ]
    }
])

export default router;