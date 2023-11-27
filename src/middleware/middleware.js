const { ResponseTemplate } = require('../helpers/resp.helper')
const Joi = require('joi')

function CheckRegister(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().max(255).required(),
        username: Joi.string().max(18).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()]{8,30}$')).required(),
        birth_date: Joi.date().iso().required(),
        age:Joi.number().positive().required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
        let response = ResponseTemplate(null, 'invalid request', error.details[0].message, 400)
        return res.status(400).json(response)
    }
    next()
}


module.exports = {
    CheckRegister
}