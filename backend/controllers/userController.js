import * as userService from '../services/userService.js';
import * as tokenModel from '../models/tokenModel.js';
import jwt from 'jsonwebtoken';
import { createAccessToken, createRefreshToken } from '../utils/token.js';

const issueTokens = async (user, res) => {

    const accesstoken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenModel.create(user.user_code, refreshToken, expiresAt);

    res.cookie('refreshToken', refreshToken, {
        httpOnly:true,
        secure:process.env.NODE_ENV == 'production',
        sameSite: 'lax',
        expires: expiresAt
    });

    return accesstoken;
}

export const createUser = async(req, res, next) => {
    try {
        const data = req.body;
        const newUser = await userService.createUser(data);

        const accesstoken = await issueTokens(newUser, res);
        res.status(201).json({...newUser, accesstoken});
    } catch(err){
        next(err);
    }
}

export const existsEmail = async(req, res, next) => {
    try {
        const email = req.query.email;
        res.status(201).json(await userService.existsEmail(email));
    } catch(err) {
        next(err);
    }
}

export const signIn = async(req, res, next) => {
    try {
        const data = req.body;
        const user = await userService.signIn(data);
        if(!user) return res.status(401).send({error:'확인되는 계정이 없습니다.'});

        const accessToken = await issueTokens(user, res);
        res.status(200).json({...user, accessToken});
    } catch(err) {
        next(err);
    }
}

export const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.status(200).send({accessToken: null});

    try {
        const tokenRecord = await tokenModel.selectToken(refreshToken);
        if(!tokenRecord || new Date() > new Date(tokenRecord.expiresAt)) {
            await tokenModel.deleteToken(tokenRecord);
            res.clearCookie('refreshToken');
            return res.status(401).send({message:'Refresh token expired or invalid'});
        }

        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const data = {user_code:decode.user.user_code, role:decode.user.role, status:decode.user.status, profile:decode.user.profile};
        const newAccessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'5m'});

        res.status(200).json({accessToken:newAccessToken});
    } catch(err) {
        res.clearCookie('refreshToken');
        await tokenModel.deleteToken(refreshToken);
        return res.status(403).send({message:'Invalid Refresh Token'});
    }
}

export const signOut = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) await tokenModel.deleteToken(refreshToken);
        res.clearCookie('refreshToken');
        res.status(200).send({message:'log-out'});
    } catch(err) {
        next(err);
    }    
}

export const me = (req, res, next) => {
    try {
        const user = req.user;
        if(!user) return res.status(201).send({message:'no user'});
        res.status(200).json(user);
    } catch(err) {
        next(err);
    }
}

