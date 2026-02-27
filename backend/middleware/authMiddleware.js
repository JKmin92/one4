import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token || token === 'null' || !authHeader.startsWith('Bearer ')) return res.status(200).json({ message: 'no token' });

    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch {
        return res.status(401).send({ error: 'Invalid Token' });
    }
}