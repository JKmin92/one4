import * as displayService from '../../services/review/displayService.js';

export const getActiveBanners = async (req, res, next) => {
    try {
        const banners = await displayService.getActiveBanners();
        res.status(200).json(banners);
    } catch (err) {
        next(err);
    }
}
