import * as noticeModel from '../../../models/admin/review/noticeModel.js';
import { generateUniqueId } from '../../../utils/customUtils.js';

export const getNoticeList = async (limit, offset) => {
    return await noticeModel.getNoticeList(limit, offset);
}

export const getNoticeById = async (notice_code) => {
    return await noticeModel.getNoticeById(notice_code);
}

export const createNotice = async (data) => {
    data.notice_code = `NTC${generateUniqueId()}`;
    return await noticeModel.insertNotice(data);
}

export const updateNotice = async (notice_code, data) => {
    return await noticeModel.updateNotice(notice_code, data);
}

export const deleteNotice = async (notice_code) => {
    return await noticeModel.deleteNotice(notice_code);
}

export const uploadImage = async (file) => {
    const { uploadFile } = await import('../../../utils/fileUpload.js');
    return await uploadFile(file, 'review/notice', 'editor');
}
