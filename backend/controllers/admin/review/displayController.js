import * as displayService from '../../../services/admin/review/displayService.js';

export const getBannerList = async (req, res, next) => {
    try {
        const banners = await displayService.getBannerList();
        res.status(200).json(banners);
    } catch (err) {
        next(err);
    }
}

export const createBanner = async (req, res, next) => {
    try {
        const newBanner = await displayService.createBanner(req.body, req.files);
        res.status(201).json(newBanner);
    } catch (err) {
        next(err);
    }
}

export const updateBanner = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedBanner = await displayService.updateBanner(id, req.body, req.files);
        res.status(200).json(updatedBanner);
    } catch (err) {
        next(err);
    }
}

export const deleteBanner = async (req, res, next) => {
    try {
        const id = req.params.id;
        await displayService.deleteBanner(id);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}

export const updateBannerOrder = async (req, res, next) => {
    try {
        const orderList = req.body;
        await displayService.updateBannerOrder(orderList);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
}
