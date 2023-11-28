const { ResponseTemplate } = require('../helpers/resp.helper')
const { InternalServerError } = require('../server/server.error')
const { PrismaClient } = require('@prisma/client')
const imagekit = require('../libs/imagekit')

const prisma = new PrismaClient

async function ListUsers(req, res) {

    const { username, email, password } = req.query
    const payload = {}

    if (username) {
        payload.username = username
    }

    if (email) {
        payload.email = email
    }

    if (password) {
        payload.password = password
    }

    try {

        const users = await prisma.users.findMany({
            where: payload,
            select: {
                name: true,
                profile_photo: true,
                is_verified: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true
            },
            orderBy: {
                name: 'asc'
            }
        })

        let response = ResponseTemplate(users, 'success', null, 200)
        return res.status(200).json(response)

    } catch (error) {
        throw new InternalServerError(error.message)
    }
}

async function ViewProfile(req, res) {

    const { username } = req.params

    try {
        const checkUsername = await prisma.users.findUnique({
            where: {username: username}
        })

        if (!checkUsername) {
            return res.status(404).json({
                message: `${username} not found`,
                status: 404
            })
        }

        const viewProfile = await prisma.users.findUnique({
            where: {
                username : username
            },
            select: {
                name: true,
                username: true,
                profile_photo: true,
                birth_date: true,
                age: true,
                createdAt:true
            }
        })

        let response = ResponseTemplate(viewProfile, 'success', null, 200)
        return res.status(200).json(response)

    } catch (error) {
        throw new InternalServerError(error.message)
    }
}

async function ChangePhoto(req, res) {

    const fileString = req.file.buffer.toString('base64')
    const uploadImage = await imagekit.upload({
        fileName: req.file.originalname,
        file: fileString
    })

    try {
        const changePhoto = await prisma.users.update({
            where: { id: req.users.id },
            data: { profile_photo: uploadImage.url },
            select: {
                username: true,
                profile_photo: true,
                updatedAt: true,
            }
        })

        let response = ResponseTemplate(changePhoto, 'success', null, 200)
        return res.status(200).json(response)

    } catch (error) {
        throw new InternalServerError(error.message)
    }
}

async function DeleteUser(req, res) {

    const { username } = req.params

    try {

        const checkUser = await prisma.users.findUnique({
            where: { username }
        })

        if (!checkUser) {
            return res.status(404).json({
                message: `${username} not found`,
                status: 404
            })
        }

        await prisma.users.delete({
            where: {
                username
            }
        })

        return res.status(200).json({
            message: 'success',
            status: 200
        })

    } catch (error) {
        throw new InternalServerError(error.message)
    }
}


module.exports = {
    ListUsers,
    ViewProfile,
    ChangePhoto,
    DeleteUser
}