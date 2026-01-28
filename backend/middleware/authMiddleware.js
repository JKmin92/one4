import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token) return res.status(401).send({error:'no token'});

    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch(err) {
        return res.status(403).send({error:'Invalid Token'});
    }
}