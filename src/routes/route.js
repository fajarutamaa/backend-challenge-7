const router = require('express').Router()
const morgan = require('morgan')
const { ForgotPassword, ResetPassword } = require('../controllers/auth/auth.controller')
const authRoute = require('../routes/auth/auth.route')
const userRoute = require('../routes/user.route')
const activationRoute = require('./activation.route')

router.use(morgan('combined'))

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/activation', activationRoute)
router.use('/forgot-password', ForgotPassword)
router.use('/reset-password', ResetPassword)

module.exports = router