import * as userService from '../services/userService.js';
import * as tokenModel from '../models/tokenModel.js';
import jwt from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from '../utils/token.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const issueTokens = async (user, res, autoLogin = true) => {

    const accesstoken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenModel.create(user.user_code, refreshToken, expiresAt);

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV == 'production',
        sameSite: 'lax',
    };

    if (autoLogin) {
        cookieOptions.expires = expiresAt;
    }

    res.cookie('refreshToken', refreshToken, cookieOptions);

    return accesstoken;
}

export const createUser = async (req, res, next) => {
    try {
        const data = req.body;
        const newUser = await userService.createUser(data);

        const accessToken = await issueTokens(newUser, res, true);
        res.status(201).json({ ...newUser, accessToken });
    } catch (err) {
        next(err);
    }
}

export const existsEmail = async (req, res, next) => {
    try {
        const email = req.query.email;
        res.status(201).json(await userService.existsEmail(email));
    } catch (err) {
        next(err);
    }
}

export const signIn = async (req, res, next) => {
    try {
        const data = req.body;
        const autoLogin = data.autoLogin !== undefined ? data.autoLogin : true; // default to true if not provided
        const user = await userService.signIn(data);
        if (!user) return res.status(200).json({ success: false, error: '확인되는 계정이 없습니다.' });

        const accessToken = await issueTokens(user, res, autoLogin);
        res.status(200).json({ ...user, accessToken });
    } catch (err) {
        next(err);
    }
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(200).send({ accessToken: null });

    try {
        const tokenRecord = await tokenModel.selectToken(refreshToken);
        if (!tokenRecord || new Date() > new Date(tokenRecord.expiresAt)) {
            await tokenModel.deleteToken(tokenRecord);
            res.clearCookie('refreshToken');
            return res.status(401).send({ message: 'Refresh token expired or invalid' });
        }

        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const userPayload = decode.user || decode;
        
        // 사용자가 실질적으로 활동 중임을 나타내기 위해 접속 시간 갱신
        await userService.updateLastLogin(userPayload.user_code);

        const data = {
            user_code: userPayload.user_code,
            role: userPayload.role,
            status: userPayload.status,
            name: userPayload.name,
            email: userPayload.email,
            profile: userPayload.profile,
            phone: userPayload.phone
        };
        const newAccessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        res.clearCookie('refreshToken');
        await tokenModel.deleteToken(refreshToken);
        return res.status(403).send({ message: 'Invalid Refresh Token' });
    }
}

export const signOut = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) await tokenModel.deleteToken(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).send({ message: 'log-out' });
    } catch (err) {
        next(err);
    }
}

export const me = (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const getUserProfile = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserProfile(user.user_code));
    } catch (err) {
        next(err);
    }
}

export const updateUserProfile = async (req, res, next) => {
    try {
        const user = req.user;
        const { name, phone, marketingAgree, profileImage } = req.body;

        let updateData = {
            user_code: user.user_code,
            name,
            phone,
            marketingAgree: marketingAgree === 'true' || marketingAgree === true ? 1 : 0
        };

        if (profileImage === 'DELETED') {
            updateData.profile = null;
        }

        if (req.file) {
            const uploadDir = path.resolve(`public/uploads/${user.user_code}/profile`);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `${Date.now()}.webp`;
            const filePath = path.join(uploadDir, fileName);

            await sharp(req.file.buffer)
                .resize(500, 500, {
                    fit: 'cover',
                    position: 'center',
                    withoutEnlargement: true
                })
                .webp({ quality: 80 })
                .toFile(filePath);

            updateData.profile = `/uploads/${user.user_code}/profile/${fileName}`;
        }

        const updatedUser = await userService.updateUserProfile(updateData);
        const newAccessToken = await issueTokens(updatedUser, res);

        res.status(200).json({ ...updatedUser, accessToken: newAccessToken });
    } catch (err) {
        next(err);
    }
}

export const getUserAddress = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserAddress(user.user_code));
    } catch (err) {
        next(err);
    }
}

export const insertUserAddress = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.insertUserAddress({ ...req.body, user_code: user.user_code }));
    } catch (err) {
        next(err);
    }
}

export const updateUserAddress = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.updateUserAddress({ ...req.body, user_code: user.user_code }));
    } catch (err) {
        next(err);
    }
}

export const deleteUserAddress = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.deleteUserAddress(req.params.address_code, user.user_code));
    } catch (err) {
        next(err);
    }
}

export const getUserReviewChannelList = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserReviewChannelList(user.user_code));
    } catch (err) {
        next(err);
    }
}

export const getUserReviewChannel = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserReviewChannel(user.user_code, req.params.review_channel_code));
    } catch (err) {
        next(err);
    }
}

export const insertUserReviewChannel = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.insertUserReviewChannel({ ...req.body, user_code: user.user_code }));
    } catch (err) {
        next(err);
    }
}

export const deleteUserReviewChannel = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.deleteUserReviewChannel(req.params.review_channel_code, user.user_code));
    } catch (err) {
        next(err);
    }
}

export const updateUserReviewChannel = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.updateUserReviewChannel({ ...req.body, user_code: user.user_code }));
    } catch (err) {
        next(err);
    }
}

export const updatePassword = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.updatePassword(user.user_code, req.body.currentPassword, req.body.newPassword));
    } catch (err) {
        next(err);
    }
}

export const insertUserAccount = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.insertUserAccount({ ...req.body, user_code: user.user_code }));
    } catch (err) {
        next(err);
    }
}

export const getUserAccountList = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserAccountList(user.user_code));
    } catch (err) {
        next(err);
    }
}

export const updateUserAccountBasic = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.updateUserAccountBasic(req.params.account_code, user.user_code));
    } catch (err) {
        next(err);
    }
}

export const deleteUserAccount = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.deleteUserAccount(req.params.account_code, user.user_code));
    } catch (err) {
        next(err);
    }
}

export const getUserPointHistory = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserPointHistory(user.user_code));
    } catch (err) {
        next(err);
    }
}

export const getUserPoint = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserPoint(user.user_code));
    } catch (err) {
        next(err);
    }
}

export const getUserPointPayoutList = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.getUserPointPayoutList(user.user_code));
    } catch (err) {
        next(err);
    }
}

export const insertUserPointPayout = async (req, res, next) => {
    try {
        const user = req.user;
        await userService.insertUserPointPayout({ ...req.body, user_code: user.user_code });
        res.status(200).json({ message: 'success' });
    } catch (err) {
        next(err);
    }
}

export const userPasswordCheck = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.userPasswordCheck(req.body.password, user.user_code));
    } catch (err) {
        next(err);
    }
}

export const userWithdraw = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json(await userService.userWithdraw(user.user_code, req.body.password));
    } catch (err) {
        next(err);
    }
}