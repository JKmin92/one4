import * as displayModel from '../../models/admin/review/displayModel.js';

export const getActiveBanners = async () => {
    return await displayModel.getActiveBanners();
}
