import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token || token === 'null' || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: '로그인이 필요합니다.' });

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded.user || decoded;
        next();
    } catch {
        return res.status(401).send({ error: 'Invalid Token' });
    }
}