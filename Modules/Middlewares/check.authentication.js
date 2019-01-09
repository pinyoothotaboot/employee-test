const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.NODE_JWT_KEY);
        req.userData = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            error: {
                message: err
            }
        });
    }
}