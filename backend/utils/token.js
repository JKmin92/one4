import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => 
    jwt.sign(
        {user:user},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRE}
    )

export const createRefreshToken = (user) =>
    jwt.sign(
        {user:user},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRE}
    )
