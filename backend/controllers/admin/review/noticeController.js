import * as noticeService from '../../../services/admin/review/noticeService.js';

export const getNoticeList = async (req, res, next) => {
    try {
        const { limit, offset } = req.query;
        const result = await noticeService.getNoticeList(limit, offset);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export const getNoticeById = async (req, res, next) => {
    try {
        const notice_code = req.params.notice_code;
        const notice = await noticeService.getNoticeById(notice_code);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });
        res.status(200).json(notice);
    } catch (err) {
        next(err);
    }
}

export const createNotice = async (req, res, next) => {
    try {
        const newNotice = await noticeService.createNotice(req.body);
        res.status(201).json(newNotice);
    } catch (err) {
        next(err);
    }
}

export const updateNotice = async (req, res, next) => {
    try {
        const notice_code = req.params.notice_code;
        const updatedNotice = await noticeService.updateNotice(notice_code, req.body);
        res.status(200).json(updatedNotice);
    } catch (err) {
        next(err);
    }
}

export const deleteNotice = async (req, res, next) => {
    try {
        const notice_code = req.params.notice_code;
        await noticeService.deleteNotice(notice_code);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}

export const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }
        const imageUrl = await noticeService.uploadImage(req.file);
        res.status(200).json({ success: true, url: imageUrl });
    } catch (err) {
        next(err);
    }
}
