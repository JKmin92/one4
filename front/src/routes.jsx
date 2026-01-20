import { createBrowserRouter } from 'react-router-dom';

import ShopLayout from './views/shop/common/Layout';
import ShopMain from './views/shop/Main';

import ShopProductList from './views/shop/product/productList';

const router = createBrowserRouter([
    {
        path:'/',
        element : <ShopLayout />,
        children : [
            {path:'', element:<ShopMain />},
            {path:'/categorys/:id', element:<ShopProductList />}
        ]
    }
])

export default router;