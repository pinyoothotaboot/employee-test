const joi = require('joi');

const employeeSchema = joi.object().keys({
    name: joi.string().required(),
    age: joi.number().default(1).required(),
    salary: joi.number().required()
});

module.exports = {
    employeeSchema
}