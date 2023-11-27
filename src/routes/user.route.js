const router = require('express').Router()
const { ListUsers, DeleteUser, ChangePhoto, ViewProfile } = require('../controllers/user.controller')
const { Authenticate } = require('../middleware/restrict')
const storage = require('../libs/multer')

router.get('/', ListUsers)
router.delete('/delete/:username', DeleteUser)
router.put('/change-photo', Authenticate, storage.image.single('image'), ChangePhoto)
router.get('/:username', ViewProfile)

module.exports = router