const joi = require('joi');

const authenSchema = joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required()
});

const userSignupSchema = joi.object().keys({
    email: joi.string().email().required(),
    name: joi.string().required(),
    password: joi.string().required()
});

module.exports = {
    authenSchema,
    userSignupSchema
}