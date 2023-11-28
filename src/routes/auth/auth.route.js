const router = require('express').Router()
const { CheckRegister } = require('../../middleware/middleware')
const { Register, Login } = require('../../controllers/auth/auth.controller')

router.post('/register', CheckRegister, Register)
router.post('/login', Login)

module.exports = router