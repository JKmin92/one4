const RECENT_PRODUCTS_KEY = 'one4_recent_products';
const MAX_RECENT_ITEMS = 50;

export const getLocalRecentProducts = () => {
    try {
        const item = localStorage.getItem(RECENT_PRODUCTS_KEY);
        return item ? JSON.parse(item) : [];
    } catch {
        return [];
    }
};

export const addLocalRecentProduct = (productCode) => {
    const current = getLocalRecentProducts();
    const filtered = current.filter(item => String(item.product_code) !== String(productCode));
    const newItem = {
        product_code: productCode,
        dwell_time_seconds: 0,
        time_to_cart_seconds: null,
        time_to_buy_seconds: null,
        viewed_at: new Date().toISOString()
    };
    filtered.unshift(newItem);
    
    if (filtered.length > MAX_RECENT_ITEMS) {
        filtered.pop();
    }
    
    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(filtered));
};

export const updateLocalRecentProductAction = (productCode, updateData) => {
    const current = getLocalRecentProducts();
    const index = current.findIndex(item => item.product_code === productCode);
    if (index > -1) {
        current[index] = { ...current[index], ...updateData };
        localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(current));
    }
};

export const clearLocalRecentProducts = () => {
    localStorage.removeItem(RECENT_PRODUCTS_KEY);
};
