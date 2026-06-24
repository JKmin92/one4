

export function formatNumber(num) {
    if (num == null) return null;
    return Number(num).toLocaleString('ko-KR');
}

export function calcDiscountPercent(originalPrice, salePrice) {
    if (!originalPrice || originalPrice <= 0) return 0;
    const percent = ((originalPrice - salePrice) / originalPrice) * 100;
    return Math.round(percent);
}

export function formatDate(isoString) {
    const date = new Date(isoString);

    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
};

export function formatDateYMD(isoString) {
    const date = new Date(isoString);

    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');

    return `${yyyy}.${mm}.${dd}`;
};

export function formatDateToMonthDay(isoString) {
    const date = new Date(isoString);

    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${mm}.${dd}`;
}

export function scrollViewPosition(id) {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
}

export function getDDay(targetDate) {
    if (!targetDate) return '0';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = targetDate instanceof Date ? new Date(targetDate) : new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diff = target - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    return `${Math.max(days, 0)}`;
}

export const getReviewCampaignApplicationStatus = (status, campaign) => {
    switch (status) {
        case 'APPLIED':
            return { color: 'green', text: '신청 완료', date: campaign?.reviewer_selection_date, title: '선정일', date_color: 'green' };
        case 'SELECTED':
            return { color: 'blue', text: '선정 완료, 작성 및 서비스 이용 중', date: campaign?.end_write_date, title: '작성 마감일', date_color: 'orange' };
        case 'REJECTED':
            return { color: 'red', text: '미선정' };
        case 'SUBMITTED':
            return { color: 'blue', text: '리뷰 제출 완료' };
        case 'RETURNED':
            return { color: 'orange', text: '리뷰 수정 요청' };
        case 'CANCELLED':
            return { color: 'gray', text: '취소됨' };
        case 'COMPLETED':
            return { color: 'blue', text: '리뷰 작성 완료' };
        default:
            return 'gray';
    }
}

export const getReviewCampaignState = (status) => {
    const states = [
        { key: 'DRAFT', value: '임시저장', color: 'gray' },
        { key: 'PENDING', value: '대기', color: 'gray' },
        { key: 'SCHEDULED', value: '준비중', color: 'gray' },
        { key: 'RECRUITING', value: '모집중', color: 'green' },
        { key: 'SELECTING', value: '선정중(선정전)', color: 'blue' },
        { key: 'REVIEWING', value: '리뷰작성중', color: 'blue' },
        { key: 'CLOSED', value: '모집마감', color: 'gray' },
        { key: 'COMPLETED', value: '종료', color: 'gray' }
    ];
    return states.find(s => s.key === status);
}

export const getProductOrderStatus = (status) => {
    switch (status) {
        case 'PENDING':
            return { color: 'orange', text: '결제전' };
        case 'PAID':
            return { color: 'blue', text: '결제완료' };
        case 'PROCESSING':
            return { color: 'blue', text: '상품준비중' };
        case 'SHIPPING':
            return { color: 'blue', text: '배송중' };
        case 'DELIVERED':
            return { color: 'blue', text: '배송완료' };
        case 'COMPLETED':
            return { color: 'blue', text: '구매확정' };
        case 'CANCEL':
            return { color: 'red', text: '취소' };
        case 'CLAIM':
            return { color: 'orange', text: '클레임 접수' };
        default:
            return 'gray';
    }
}

export const getBankList = () => {
    return [
        { value: "국민은행", text: "국민은행" },
        { value: "신한은행", text: "신한은행" },
        { value: "우리은행", text: "우리은행" },
        { value: "KEB하나은행", text: "KEB하나은행" },
        { value: "기업은행", text: "기업은행" },
        { value: "농협은행", text: "농협은행" },
        { value: "부산은행", text: "부산은행" },
        { value: "대구은행", text: "대구은행" },
        { value: "경남은행", text: "경남은행" },
        { value: "전북은행", text: "전북은행" },
        { value: "광주은행", text: "광주은행" },
        { value: "제주은행", text: "제주은행" },
        { value: "카카오뱅크", text: "카카오뱅크" },
        { value: "케이뱅크", text: "케이뱅크" },
        { value: "토스뱅크", text: "토스뱅크" },
        { value: "산업은행", text: "산업은행" },
        { value: "수협은행", text: "수협은행" },
    ];
}