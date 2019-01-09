module.exports = function HanddleError(res, status, msg) {
    res.status(status).json({
        error: {
            message: msg
        }
    });
}