import * as model from '../../models/admin/productModel.js';
import moment from 'moment';
import * as fileUpload from '../../utils/fileUpload.js';

export const insertProductCategory = async (category) => {
    const timePart = moment().format('YYMMDDHHmmss');
    const id = `${timePart}`;
    await model.insertProductCategory({ ...category, id: id });
    return { ...category, id };
}

export const selectProductCategory = async () => {
    return await model.selectProductCategory();
}

export const updateProductCategory = async (category) => {
    return await model.updateProductCategory(category);
}

export const deleteProductCategory = async (id) => {
    return await model.deleteProductCategory(id);
}

export const updateProductCategorySortOrder = async (categories) => {
    return await model.updateProductCategorySortOrder(categories);
}

export const insertProduct = async (productData, files) => {

    const id = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    let mainImageUrl = '';
    if (files.mainImage && files.mainImage[0]) {
        mainImageUrl = await fileUpload.uploadFile(files.mainImage[0], 'product', id);
    }

    const subImageUrls = [];
    if (files.subImages && files.subImages.length > 0) {
        for (const file of files.subImages) {
            const url = await fileUpload.uploadFile(file, 'product', id);
            subImageUrls.push(url);
        }
    }
    await model.insertProduct({ ...productData, id: id });

    if (productData.has_option === 'on' && productData.options) {
        let options = [];
        try {
            options = typeof productData.options === 'string' ? JSON.parse(productData.options) : productData.options;
        } catch (e) {
            console.error("Failed to parse options JSON", e);
        }

        for (const opt of options) {
            await model.insertProductOption({
                product_id: id,
                name: opt.name,
                value: opt.value,
                stock: opt.stock
            });
        }
    }

    if (mainImageUrl) {
        await model.insertProductImage({
            product_id: id,
            image_url: mainImageUrl,
            is_main: 1,
            sort_order: 1
        });
    }

    let sortOrder = 1;
    for (const url of subImageUrls) {
        await model.insertProductImage({
            product_id: id,
            image_url: url,
            is_main: 0,
            sort_order: sortOrder++
        });
    }

    if (productData.category_ids) {
        let categoryIds = [];
        try {
            categoryIds = typeof productData.category_ids === 'string' ? JSON.parse(productData.category_ids) : productData.category_ids;
        } catch (e) {
            console.error("Failed to parse category_ids JSON", e);
        }

        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        for (const catId of categoryIds) {
            await model.insertProductCategoryConnect({ product_id: id, category_id: catId });
        }
    }

    return { success: true, id };
};

export const getProductDetails = async (id) => {
    const product = await model.selectProduct(id);
    if (!product) {
        throw new Error('Product not found');
    }

    const options = await model.selectProductOptions(id);
    const images = await model.selectProductImages(id);
    const categories = await model.selectProductCategories(id);

    return { ...product, options, images, categories };
};

export const getProductList = async () => {
    const products = await model.selectProductList();
    return products.map(product => {
        if (product.images && typeof product.images === 'string') {
            try {
                product.images = JSON.parse(product.images);
            } catch (e) {
                console.error("Failed to parse images JSON for product", product.id, e);
                product.images = [];
            }
        }
        return product;
    });
};

export const updateProduct = async (id, productData, files) => {
    await model.updateProduct({ ...productData, id });

    if (productData.category_ids) {
        let categoryIds = [];
        try {
            categoryIds = typeof productData.category_ids === 'string' ? JSON.parse(productData.category_ids) : productData.category_ids;
        } catch (e) {
            console.error("Failed to parse category_ids JSON", e);
        }

        if (!Array.isArray(categoryIds)) {
            categoryIds = [categoryIds];
        }

        await model.deleteProductCategoryConnect(id);

        for (const catId of categoryIds) {
            await model.insertProductCategoryConnect({ product_id: id, category_id: catId });
        }
    }

    if (productData.has_options === 'on' && productData.options) {
        let options = [];
        try {
            options = typeof productData.options === 'string' ? JSON.parse(productData.options) : productData.options;
        } catch (e) {
            console.error("Failed to parse options JSON", e);
        }

        await model.deleteProductOptions(id);

        for (const opt of options) {
            await model.insertProductOption({
                product_id: id,
                name: opt.name,
                value: opt.value,
                stock: opt.stock
            });
        }
    } else {
        await model.deleteProductOptions(id);
    }

    /**
     * TODO : 이미지 실제 삭제 로직 필요
     */
    if (files.mainImage && files.mainImage[0]) {
        const mainImageUrl = await fileUpload.uploadFile(files.mainImage[0], 'product', id);
        await model.deleteProductMainImage(id);
        await model.insertProductImage({
            product_id: id,
            image_url: mainImageUrl,
            is_main: 1,
            sort_order: 1
        });
    }

    /**
     * TODO : 이미지 실제 삭제 로직 필요
     */
    let existingImageIds = [];
    if (productData.existing_sub_images) {
        try {
            existingImageIds = typeof productData.existing_sub_images === 'string' ? JSON.parse(productData.existing_sub_images) : productData.existing_sub_images;
        } catch (e) {
            console.error("Failed to parse existing_sub_images JSON", e);
        }
    }

    if (!Array.isArray(existingImageIds)) {
        existingImageIds = [existingImageIds];
    }

    await model.deleteProductImages(id, existingImageIds);

    let sortOrder = 1;
    for (const imgId of existingImageIds) {
        await model.updateProductImageSortOrder(imgId, sortOrder++);
    }

    if (files.subImages && files.subImages.length > 0) {
        for (const file of files.subImages) {
            const url = await fileUpload.uploadFile(file, 'product', id);
            await model.insertProductImage({
                product_id: id,
                image_url: url,
                is_main: 0,
                sort_order: sortOrder++
            });
        }
    }

    return { success: true };
};