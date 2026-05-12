import * as model from '../../../models/admin/shop/productModel.js';
import moment from 'moment';
import * as fileUpload from '../../../utils/fileUpload.js';

export const insertProductCategory = async (category) => {
    const timePart = moment().format('YYMMDDHHmmss');
    const category_code = `${timePart}`;
    await model.insertProductCategory({ ...category, category_code: category_code });
    return { ...category, category_code };
}

export const selectProductCategory = async () => {
    return await model.selectProductCategory();
}

export const updateProductCategory = async (category) => {
    return await model.updateProductCategory(category);
}

export const deleteProductCategory = async (category_code) => {
    return await model.deleteProductCategory(category_code);
}

export const updateProductCategorySortOrder = async (categories) => {
    return await Promise.all(categories.map(category => model.updateProductCategorySortOrder(category)));
}

export const insertProduct = async (productData, files) => {

    const product_code = moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0');


    let mainImageUrl = '';
    if (files.mainImage && files.mainImage[0]) {
        mainImageUrl = await fileUpload.uploadFile(files.mainImage[0], 'product', product_code);
    }

    const subImageUrls = [];
    if (files.subImages && files.subImages.length > 0) {
        for (const file of files.subImages) {
            const url = await fileUpload.uploadFile(file, 'product', product_code);
            subImageUrls.push(url);
        }
    }
    await model.insertProduct({ ...productData, product_code: product_code });

    if (productData.has_option === 'on' && productData.options) {
        let options = [];
        try {
            options = typeof productData.options === 'string' ? JSON.parse(productData.options) : productData.options;
        } catch (e) {
            console.error("Failed to parse options JSON", e);
        }

        for (const opt of options) {
            const product_option_code = `opt${moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            await model.insertProductOption({
                product_code: product_code,
                product_option_code: product_option_code,
                name: opt.name,
                value: opt.value,
                stock: opt.stock
            });
        }
    }

    if (mainImageUrl) {
        await model.insertProductImage({
            product_code: product_code,
            image_url: mainImageUrl,
            is_main: 1,
            sort_order: 1
        });
    }

    let sortOrder = 1;
    for (const url of subImageUrls) {
        await model.insertProductImage({
            product_code: product_code,
            image_url: url,
            is_main: 0,
            sort_order: sortOrder++
        });
    }

    if (productData.category_codes) {
        let categoryCodes = [];
        try {
            categoryCodes = typeof productData.category_codes === 'string' ? JSON.parse(productData.category_codes) : productData.category_codes;
        } catch (e) {
            console.error("Failed to parse category_codes JSON", e);
        }

        if (!Array.isArray(categoryCodes)) {
            categoryCodes = [categoryCodes];
        }

        for (const catCode of categoryCodes) {
            await model.insertProductCategoryConnect({ product_code: product_code, category_code: catCode });
        }
    }

    return { success: true, product_code };
};

export const getProductDetails = async (product_code) => {
    const product = await model.selectProduct(product_code);
    if (!product) {
        throw new Error('Product not found');
    }

    const options = await model.selectProductOptions(product_code);
    const images = await model.selectProductImages(product_code);
    const categories = await model.selectProductCategories(product_code);

    return { ...product, options, images, categories };
};

export const getProductList = async (keyword) => {
    const products = await model.selectProductList(keyword);
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

export const updateProduct = async (product_code, productData, files) => {
    await model.updateProduct({ ...productData, product_code });

    if (productData.category_codes) {
        let categoryCodes = [];
        try {
            categoryCodes = typeof productData.category_codes === 'string' ? JSON.parse(productData.category_codes) : productData.category_codes;
        } catch (e) {
            console.error("Failed to parse category_codes JSON", e);
        }

        if (!Array.isArray(categoryCodes)) {
            categoryCodes = [categoryCodes];
        }

        await model.deleteProductCategoryConnect(product_code);

        for (const catCode of categoryCodes) {
            await model.insertProductCategoryConnect({ product_code: product_code, category_code: catCode });
        }
    }

    if (productData.has_options === 'on' && productData.options) {
        let options = [];
        try {
            options = typeof productData.options === 'string' ? JSON.parse(productData.options) : productData.options;
        } catch (e) {
            console.error("Failed to parse options JSON", e);
        }

        await model.deleteProductOptions(product_code);


        for (const opt of options) {
            const product_option_code = `opt${moment().format('YYYYMMDDHHmmss') + Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            await model.insertProductOption({
                product_code: product_code,
                name: opt.name,
                value: opt.value,
                stock: opt.stock,
                product_option_code: product_option_code
            });
        }
    } else {
        await model.deleteProductOptions(product_code);
    }

    /**
     * TODO : 이미지 실제 삭제 로직 필요
     */
    if (files.mainImage && files.mainImage[0]) {
        const mainImageUrl = await fileUpload.uploadFile(files.mainImage[0], 'product', product_code);
        await model.deleteProductMainImage(product_code);
        await model.insertProductImage({
            product_code: product_code,
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

    await model.deleteProductImages(product_code, existingImageIds);

    let sortOrder = 1;
    for (const imgId of existingImageIds) {
        await model.updateProductImageSortOrder(imgId, sortOrder++);
    }

    if (files.subImages && files.subImages.length > 0) {
        for (const file of files.subImages) {
            const url = await fileUpload.uploadFile(file, 'product', product_code);
            await model.insertProductImage({
                product_code: product_code,
                image_url: url,
                is_main: 0,
                sort_order: sortOrder++
            });
        }
    }

    return { success: true };
};