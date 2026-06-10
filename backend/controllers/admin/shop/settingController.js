import * as settingService from '../../../services/admin/shop/settingService.js';

export const getDeliverySetting = async (req, res, next) => {
    try {
        const setting = await settingService.getDeliverySetting();
        res.status(201).json(setting);
    } catch (e) {
        next(e);
    }
}

export const updateDeliverySetting = async (req, res, next) => {
    try {
        const setting = await settingService.updateDeliverySetting(req.body);
        res.status(201).json(setting);
    } catch (e) {
        next(e);
    }
}

export const getAccountList = async (req, res, next) => {
    try {
        const accounts = await settingService.getAccountList();
        res.status(201).json(accounts);
    } catch (e) {
        next(e);
    }
}

export const getAccount = async (req, res, next) => {
    try {
        const account = await settingService.getAccount(req.params.account_code);
        res.status(201).json(account);
    } catch (e) {
        next(e);
    }
}

export const updateAccount = async (req, res, next) => {
    try {
        const account = await settingService.updateAccount(req.body);
        res.status(201).json(account);
    } catch (e) {
        next(e);
    }
}

export const insertAccount = async (req, res, next) => {
    try {
        const account = await settingService.insertAccount(req.body);
        res.status(201).json(account);
    } catch (e) {
        next(e);
    }
}

export const deleteAccount = async (req, res, next) => {
    try {
        const account = await settingService.deleteAccount(req.params.account_code);
        res.status(201).json(account);
    } catch (e) {
        next(e);
    }
}

export const updateAccountOrder = async (req, res, next) => {
    try {
        const result = await settingService.updateAccountOrder(req.body);
        res.status(200).json(result);
    } catch (e) {
        next(e);
    }
}