const multer = require('multer')
const path = require('path')

function filename(req, file, callback) {
    const fileName = Date.now() + path.extname(file.originalname)
    callback(null, fileName)
}

const generateStorage = (destination) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, destination)
        },
        filename
    })
}

module.exports = {
    image: multer({
        storage: generateStorage('./public/images'),
        fileFilter: (req, file, callback) => {
            const allowMimeTypeTypes = ['image/png', 'image/jpg', 'image/jpeg']

            if (allowMimeTypeTypes.includes(file.mimetype)) {
                callback(null, true)
            } else {
                const error = new Error(`Only allowed ${allowMimeTypeTypes.join(', ')}allow to upload`)
                callback(error, false)
            }
        },
        onError: (error, next) => {
            next(error)
        }
    })
}