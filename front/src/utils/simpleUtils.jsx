

export function formatNumber(num) {
    if(num == null) return null;
    return Number(num).toLocaleString('ko-KR');
}

export function calcDiscountPercent(originalPrice, salePrice) {
    if(!originalPrice || originalPrice <= 0) return 0;
    const percent = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(percent); 
}