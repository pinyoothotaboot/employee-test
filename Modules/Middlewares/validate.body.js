const joi = require('joi');

var HanddleError = require('./handdle.error');

module.exports = function ValidateBody(res, body, schema, msg) {
    joi.validate(body, schema, (err, value) => {
        if (err) HanddleError(res, 400, msg);
    });
}