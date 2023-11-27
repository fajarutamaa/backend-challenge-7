const { ComparePassword, HashPassword } = require('../../helpers/pass.helper')
const { InternalServerError } = require('../../server/server.error')
const { UserActivation } = require('../../libs/mailer')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const expiredToken = 24 * 60 * 60 * 1000

const prisma = new PrismaClient

async function Register(req, res) {

    const { name, username, email, password, birth_date, age, is_verified } = req.body

    const hashPass = HashPassword(password)

    const payload = {
        name,
        username,
        email,
        password: hashPass,
        birth_date: new Date(birth_date),
        age: parseInt(age),
        is_verified
    }

    try {
        const checkExistence = async (field, value, message) => {
            const user = await prisma.users.findUnique({
                where: { [field]: value },
            })

            if (user) {
                res.status(400).json({
                    message: message,
                    status: 400,
                })
            }
        }

        await checkExistence('email', email, 'Email already exists')
        await checkExistence('username', username, 'Username already exists')

        const user = await prisma.users.create({
            data: {
                ...payload
            }
        })

        const activationLink = `${req.protocol}://${req.get('host')}/api/v1/activation/${user.id}`

        if (user && !user.is_verified) {
            await UserActivation(user.email, activationLink)
        }

        return res.status(200).json({
            message: 'success',
            status: 200
        })

    } catch (error) {
        throw new InternalServerError(error.message)
    }

}


async function Login(req, res) {

    const { email, password } = req.body

    try {

        const user = await prisma.users.findUnique({
            where: {
                email: email
            }
        })

        if (!user) {
            let response = ResponseTemplate(null, 'bad request', 'invalid email or password', 400)
            return res.status(400).json(response)
        }

        if (!user.is_verified) {
            let response = ResponseTemplate(null, 'account not verified', 400)
            return res.status(400).json(response)
          
        }

        let checkPassword = await ComparePassword(password, user.password)

        if (!checkPassword) {
            let response = ResponseTemplate(null, 'bad request', 'invalid email or password', 400)
            return res.status(400).json(response)
        }

        let token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })

        let refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '1d' })

        res.cookie('jwt', refreshToken, { 
            httpOnly: true,  
            sameSite: 'None', secure: true,  
            maxAge: expiredToken 
        })

        return res.status(200).json({
            access_token: token,
            message: 'success',
            status: 200
        })

    } catch (error) {
        throw new InternalServerError(error.message)
    }
}

module.exports = {
    Register,
    Login
}