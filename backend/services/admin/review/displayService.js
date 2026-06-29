import * as displayModel from '../../../models/admin/review/displayModel.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const processImage = async (file) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const relativePath = `uploads/${year}/${month}/${day}/review/display/banner`;
    const uploadDir = path.resolve('public', relativePath);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.webp`;
    const filePath = path.join(uploadDir, fileName);

    await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filePath);

    return `/${relativePath}/${fileName}`;
}

export const getBannerList = async () => {
    return await displayModel.getBannerList();
}

export const createBanner = async (data, files) => {
    if (files) {
        if (files.image_pc) {
            data.image_pc = await processImage(files.image_pc[0]);
        }
        if (files.image_mobile) {
            data.image_mobile = await processImage(files.image_mobile[0]);
        }
        if (files.image_tablet) {
            data.image_tablet = await processImage(files.image_tablet[0]);
        }
    }
    return await displayModel.insertBanner(data);
}

export const updateBanner = async (id, data, files) => {
    if (files) {
        if (files.image_pc) {
            data.image_pc = await processImage(files.image_pc[0]);
        }
        if (files.image_mobile) {
            data.image_mobile = await processImage(files.image_mobile[0]);
        }
        if (files.image_tablet) {
            data.image_tablet = await processImage(files.image_tablet[0]);
        }
    }
    return await displayModel.updateBanner(id, data);
}

export const deleteBanner = async (id) => {
    return await displayModel.deleteBanner(id);
}

export const updateBannerOrder = async (orderList) => {
    return await displayModel.updateBannerOrder(orderList);
}
