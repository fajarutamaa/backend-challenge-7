const { PrismaClient } = require('@prisma/client')
const { NotifActivation } = require('../libs/mailer')
const { InternalServerError } = require('../server/server.error')

const prisma = new PrismaClient


async function ActivateAccount(req, res) {

    const { id } = req.params

    try {
        if (id !== id) {
            return res.status(400).json({
                message: 'Invalid activation account',
                status: 400,
            })
        }
        
        // Update the user's is_verified status in the database
        const user = await prisma.users.update({
            where: {
                id: id,
            },
            data: {
                is_verified: true,
            },
        })

        if (user.is_verified) {
            await NotifActivation(user.email)
        }

        return res.status(200).json({
            message: 'Account activated successfully',
            status: 200,
        })

    } catch (error) {
        throw new InternalServerError(error.message)
    }
}

module.exports = { ActivateAccount }