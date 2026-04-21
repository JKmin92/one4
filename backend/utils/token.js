import jwt from 'jsonwebtoken';

export const createAccessToken = (user) =>
    jwt.sign(
        { user_code: user.user_code, role: user.role, status: user.status, profile: user.profile, name: user.name, email: user.email, phone: user.phone },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
    )

export const createRefreshToken = (user) =>
    jwt.sign(
        { user_code: user.user_code, role: user.role, status: user.status, profile: user.profile, name: user.name, email: user.email, phone: user.phone },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
    )
