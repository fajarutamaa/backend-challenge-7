const { ComparePassword, HashPassword } = require('../../helpers/pass.helper')
const { InternalServerError } = require('../../server/server.error')
const { ResponseTemplate } = require('../../helpers/resp.helper')
const { UserActivation, SendResetEmail } = require('../../libs/mailer')
const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')


const expiredToken = 24 * 60 * 60 * 1000

const resetToken = {}

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
                where: { [field]: value }
            })

            if (user) {
                res.status(400).json({
                    message: message,
                    status: 400
                })
            }
        }

        await checkExistence('email', email, 'email already exists')
        await checkExistence('username', username, 'username already exists')

        const user = await prisma.users.create({
            data: {
                ...payload
            }
        })

        const activationLink = `${process.env.BASE_URL}/activation/${user.id}`

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
            sameSite: 'None',
            secure: true,
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

async function ForgotPassword(req, res) {

    const { email } = req.body

    try {

        const checkUser = await prisma.users.findUnique({
            where: { email: email }
        })

        if (!checkUser) {
            return res.status(404).json({
                message: 'user not found',
                status: 404
            })
        }

        let token = jwt.sign(checkUser, process.env.JWT_SECRET_KEY, { expiresIn: '15m' })
        resetToken[checkUser.id] = token

        const resetLink = `${process.env.BASE_URL}/reset-password/${token}`

        if (checkUser.is_verified) {
            await SendResetEmail(checkUser.email, resetLink)
        }

        return res.status(200).json({
            token: token,
            message: 'success',
            status: 200
        })

    } catch (error) {
        throw new InternalServerError(error.message)
    }

}

async function ResetPassword(req, res) {
    const { email, newPassword } = req.body

    try {
        const user = await prisma.users.findUnique({
            where: {
                email: email
            },
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = HashPassword(newPassword)
        user.password = hashedPassword

        delete resetToken[user.id]

        await prisma.users.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })
        
        return res.status(200).json({ 
            message: 'password reset successful',
            status:200 
        })


    } catch (error) {
        throw new InternalServerError(error.message)
    }
}

module.exports = {
    Register,
    Login,
    ForgotPassword,
    ResetPassword
}