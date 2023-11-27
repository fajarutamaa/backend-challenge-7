const router = require('express').Router()
const morgan = require('morgan')
const authRoute = require('../routes/auth/auth.route')
const userRoute = require('../routes/user.route')
const activationRoute = require('./activation.route')

router.use(morgan('combined'))

router.use('/auth', authRoute)
router.use('/users', userRoute)
router.use('/activation', activationRoute)

module.exports = router