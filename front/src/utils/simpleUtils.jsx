

export function formatNumber(num) {
    if(num == null) return null;
    return Number(num).toLocaleString('ko-KR');
}

export function calcDiscountPercent(originalPrice, salePrice) {
    if(!originalPrice || originalPrice <= 0) return 0;
    const percent = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(percent); 
}

export function formatDate (isoString) {
    const date = new Date(isoString);

    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

export function scrollViewPosition(id) {
    const el = document.getElementById(id);
    el?.scrollIntoView({behavior:'smooth'});
}