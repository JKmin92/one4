import * as model from '../../../models/admin/shop/settingModel.js';
import { generateUniqueId } from '../../../utils/customUtils.js';

export const getDeliverySetting = async () => {
    return await model.getDeliverySetting();
}

export const updateDeliverySetting = async (setting) => {
    return await model.updateDeliverySetting(setting);
}

export const getAccountList = async () => {
    return await model.getAccountList();
}

export const getAccount = async (account_code) => {
    return await model.getAccount(account_code);
}

export const updateAccount = async (account) => {
    return await model.updateAccount(account);
}

export const insertAccount = async (account) => {
    const account_code = generateUniqueId();
    return await model.insertAccount({ ...account, account_code });
}

export const deleteAccount = async (account_code) => {
    return await model.deleteAccount(account_code);
}

export const updateAccountOrder = async (orders) => {
    return await model.updateAccountOrder(orders);
}

export const getShopOrderSetting = async () => {
    return await model.getShopOrderSetting();
}

export const updateShopOrderSetting = async (setting) => {
    return await model.updateShopOrderSetting(setting);
}