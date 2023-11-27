const { ResponseTemplate } = require('../helpers/resp.helper')
const jwt = require('jsonwebtoken')


async function Authenticate(req, res, next) {

    const { authorization } = req.headers

    if (!authorization) {
        let response = ResponseTemplate(null, 'user unauthorized', null, 401)
        return res.status(401).json(response)
    }

    try {
        const user = await jwt.verify(authorization, process.env.JWT_SECRET_KEY)
        req.users = user
        next()
    } catch (error) {
        let response = ResponseTemplate(null, 'user unauthorized', null, 401)
        return res.status(401).json(response)
    }
}

module.exports = { Authenticate }