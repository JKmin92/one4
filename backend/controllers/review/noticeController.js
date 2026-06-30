import * as noticeService from '../../services/review/noticeService.js';

export const getActiveNotices = async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
        const notices = await noticeService.getActiveNotices(limit);
        res.status(200).json(notices);
    } catch (err) {
        next(err);
    }
}

export const getNoticeDetail = async (req, res, next) => {
    try {
        const notice_code = req.params.notice_code;
        const notice = await noticeService.getNoticeDetail(notice_code, true);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });
        res.status(200).json(notice);
    } catch (err) {
        next(err);
    }
}
