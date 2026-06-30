import * as noticeModel from '../../models/admin/review/noticeModel.js';

export const getActiveNotices = async (limit) => {
    return await noticeModel.getActiveNotices(limit);
}

export const getNoticeDetail = async (notice_code, shouldIncrement = true) => {
    if (shouldIncrement) {
        await noticeModel.incrementViewCount(notice_code);
    }
    return await noticeModel.getNoticeById(notice_code);
}
