import jwt from 'jsonwebtoken';
const SECRET_KEY = 'one4secret2026';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.splite(' ')[1];

    if(!token) return res.status(401).send({error:'no token'});

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch(err) {
        return res.status(403).send({error:'Invalid Token'});
    }
}