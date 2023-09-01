const jwt = require('jsonwebtoken');

const middleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.send('Token không hợp lệ');
    };
}

module.exports = middleware;
