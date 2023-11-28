const router = require('express').Router()
const multer = require('multer')()
const { ListUsers, DeleteUser, ChangePhoto, ViewProfile } = require('../controllers/user.controller')
const { Authenticate } = require('../middleware/restrict')

router.get('/', ListUsers)
router.delete('/delete/:username', DeleteUser)
router.put('/change-photo', Authenticate, multer.single('image'), ChangePhoto)
router.get('/:username', ViewProfile)

module.exports = router